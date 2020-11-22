import { put, call, takeLatest, all, select, fork } from 'redux-saga/effects'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as domainsActions } from '../redux/domains'
import { types as adTypes, actions as adActions } from '../redux/ads'
import { actions as userActions, getApiToken, getSubscribeAll, getFromPush } from '../redux/user'
import { actions as themeActions } from '../redux/theme'
import { actions as articleActions } from '../redux/articles'
import { actions as savedArticleActions } from '../redux/savedArticles'
import { getActiveDomain, getSavedDomains } from '../redux/domains'

import { fetchMenu } from '../sagas/menu'
import {
    checkNotificationSettings,
    subscribe,
    fetchNotificationSubscriptions,
    findOrCreateUser,
} from '../sagas/user'

import domainApiService from '../api/domain'
import apiService from '../api/api'

import * as Linking from 'expo-linking'

import { handleArticlePress } from '../utils/articlePress'

import * as Amplitude from 'expo-analytics-amplitude'
import * as Sentry from 'sentry-expo'
import * as SplashScreen from 'expo-splash-screen'

async function hideSplashScreen() {
    await SplashScreen.hideAsync()
}

function* initializeUser() {
    try {
        yield put(globalActions.initializeUserRequest())

        yield call(findOrCreateUser)

        yield put(globalActions.initializeUserSuccess())
        // yield call(hideSplashScreen)
    } catch (err) {
        console.log('error initializing user in saga', err)
        yield put(globalActions.initializeUserError('error initializing user'))
    }
}

function* startup(action) {
    // if coming from deep link need to handle that
    // make sure app doesn't redirect to home screen

    const { domain } = action
    const userSubscribeAll = yield select(getSubscribeAll)
    const fromPush = yield select(getFromPush)
    try {
        yield put(globalActions.startupRequest())

        // set user domain for analytics
        Amplitude.setUserProperties({
            activeDomain: domain.id,
        })

        // get splash image right away
        const splashScreenUrl = yield call(getSplashScreenImage, domain)
        yield put(globalActions.receiveSplash(splashScreenUrl))
        yield call(SplashScreen.hideAsync)

        // get menus and sync with DB -- save updated DB categories to push notification categories -- return obj with menu and DB categories
        const { menu, dbCategories } = yield call(fetchMenu, {
            domain,
        })

        // // make sure push token has been stored
        const token = yield call(checkNotificationSettings)

        // // check if user selected all notifications
        if (token && userSubscribeAll) {
            yield call(subscribe, {
                payload: {
                    subscriptionType: 'categories',
                    domainId: domain.id,
                    ids: dbCategories.map((category) => {
                        return category.id
                    }),
                },
            })
        }
        // // reset all notifications toggle key
        yield put(userActions.setSubscribeAll(false))

        // get users notification subscriptions
        yield call(fetchNotificationSubscriptions, domain.id)

        //get domains custom options
        yield call(getCustomOptions, domain)

        let activeCategory = menu[0].object_id

        yield put(
            articleActions.fetchArticlesIfNeeded({
                domain: domain.url,
                category: activeCategory,
            })
        )

        yield put(globalActions.setActiveCategory(activeCategory))

        yield put(savedArticleActions.initializeSaved(domain.id))

        // throw new Error()

        // if (fromPush) {
        //     // go to main app
        //     // NavigationService.navigate('MainApp')
        //     NavigationService.nestedNavigate('MainApp', 'RecentStack')

        //     yield call(handleArticlePress, fromPush, domain)
        //     // yield call(handleArticlePress, testFromPush, domain)
        //     // reset push key
        //     yield put(userActions.setFromPush(false))
        // } else {
        //     NavigationService.navigate('MainApp')
        // }

        yield put(globalActions.startupSuccess())
    } catch (err) {
        console.log('startup saga error', err)
        // clear from push data if any is there
        yield put(userActions.setFromPush(false))

        // check if domain is still in DB
        const domainCheck = yield call(checkIfDomainIsInDb, domain.id)

        if (domainCheck.length) {
            yield put(globalActions.startupError('error initializing app'))
            Sentry.captureException(err)
        } else {
            yield put(globalActions.startupError('school not in DB'))
        }
    }
}

function* getHomeScreenArticles() {
    try {
        const domain = yield select(getActiveDomain)
        const homeScreenCategories = yield select((state) => state.global.homeScreenCategories)

        yield put(globalActions.fetchHomeScreenArticlesRequest())

        yield all(
            homeScreenCategories
                .filter((cat) => cat)
                .map((category) => {
                    return put(
                        articleActions.fetchArticlesIfNeeded({
                            domain: domain.url,
                            category: category,
                        })
                    )
                })
        )

        yield put(globalActions.fetchHomeScreenArticlesSuccess())
    } catch (err) {
        console.log('error fetching home screen categories', err)
        yield put(globalActions.fetchHomeScreenArticlesError('network error'))
    }
}

function* getCustomOptions(domain) {
    try {
        const results = yield call(domainApiService.getCustomOptions, domain.url)
        const categories = yield call(domainApiService.fetchCategories, domain.url)
        console.log('all categories', categories)

        yield put(globalActions.receiveHeader(results.nav_header))
        yield put(globalActions.receiveHeaderLogo(results.header_logo))
        yield put(
            themeActions.saveTheme({
                primary: results.primary_color,
                accent: results.accent_color,
                homeCategoryColor: results.home_category_color,
            })
        )
        yield put(globalActions.receiveCommentsOption(results.comments === 'Enable' ? true : false))
        yield put(
            globalActions.receiveStoryListStyle(
                results.list_type === 'small' ||
                    results.list_type === 'large' ||
                    results.list_type === 'mix' ||
                    results.list_type === 'alternating'
                    ? results.list_type
                    : 'small'
            )
        )
        yield put(globalActions.receiveAppAdOptions(results.ads))
        yield put(globalActions.receiveHomeScreenMode(results.legacy_home))
        yield put(
            globalActions.receiveHomeScreenListStyle(
                results.home_list_type === 'small' ||
                    results.home_list_type === 'large' ||
                    results.home_list_type === 'mix' ||
                    results.home_list_type === 'alternating'
                    ? results.home_list_type
                    : 'small'
            )
        )
        yield put(globalActions.receiveSportCenterOption(results.has_sportcenter))

        yield fork(fetchAds, domain, results.ads)

        // always fetch
        if (true || results.legacy_home === 'categories') {
            const results = yield call(domainApiService.getHomeScreenCategories, domain.url)

            const homeScreenCategories = [
                results.home_category_1,
                results.home_category_2,
                results.home_category_3,
            ]
            const homeScreenCategoryAmounts = [
                results.home_category_1_amount,
                results.home_category_2_amount,
                results.home_category_3_amount,
            ]

            yield put(globalActions.receiveHomeScreenCategories(homeScreenCategories))
            yield put(globalActions.receiveHomeScreenCategoryAmounts(homeScreenCategoryAmounts))

            yield fork(getHomeScreenArticles)
        }
    } catch (err) {
        console.log('error in get custom domain options saga', err)

        yield put(globalActions.receiveHeader(''))
        yield put(globalActions.receiveHeaderLogo(''))
        yield put(globalActions.receiveCommentsOption(false))
        yield put(globalActions.receiveSportCenterOption(false))
        yield put(globalActions.receiveStoryListStyle('small'))
        yield put(globalActions.receiveHomeScreenListStyle('small'))
    }
}

function* getSplashScreenImage(domain) {
    try {
        const splashScreenId = yield call(domainApiService.getSplashScreenId, domain.url)

        if (splashScreenId.result && splashScreenId.result != false) {
            // get splash image
            const splashImage = yield call(
                domainApiService.getSplashScreenImage,
                domain.url,
                splashScreenId.result
            )

            if (splashImage[0]) {
                return splashImage[0].source_url
            } else {
                return ''
            }
        } else {
            return ''
        }
    } catch (err) {
        console.log('error in get splash screen saga', err, err.repsonse)
        return ''
    }
}

function* checkIfDomainIsInDb(domainId) {
    try {
        const apiToken = yield select(getApiToken)

        const dbDomain = yield call(apiService.findDomain, apiToken, domainId)
        return dbDomain
    } catch (err) {
        console.log('error getting domain from DB', err)
        return []
    }
}

function* initializeDeepLinkUser({ params: { schoolId } }) {
    try {
        // if deep link this will run
        yield put(globalActions.initializeDeepLinkUserRequest())

        console.log('in deep link init', schoolId)
        yield call(findOrCreateUser)

        // SplashScreen.hide()
        // NavigationService.navigate('DeepSelect', { schoolId: schoolId })

        yield put(globalActions.initializeDeepLinkUserSuccess())
    } catch (err) {
        console.log('error initializing deep link user in saga', err)
        yield put(globalActions.initializeDeepLinkUserError('error initializing deep link user'))
    }
}

function* fetchAds(domain, adOptions) {
    try {
        yield all(
            Object.keys(adOptions).map((adName) => {
                if (adOptions[adName]) {
                    if (adOptions[adName] === 'snoads') {
                        return call(fetchSnoAdInfo, domain, adName)
                    } else {
                        return call(fetchAdType, domain, adName)
                    }
                } else return null
            })
        )
    } catch (err) {
        console.log('error getting ad images', err)
    }
}

function* fetchAdType(domain, adName) {
    try {
        const response = yield call(domainApiService.getAds, domain.url, adName)
        yield put(adActions.fetchAdsSuccess(adName, response))
    } catch (err) {
        console.log('error in fetch ad type', err)
        throw err
    }
}

function* fetchSnoAdInfo(domain, adName) {
    try {
        const response = yield call(domainApiService.getSnoAdInfo, domain.url)
        yield put(adActions.fetchAdsSuccess(adName, response))
    } catch (err) {
        console.log('error in fetch sno ad info', err)
        throw err
    }
}

function* startupSaga() {
    yield all([
        takeLatest(globalTypes.STARTUP, startup),
        takeLatest(globalTypes.INITIALIZE_USER, initializeUser),
        // takeLatest(globalTypes.INITIALIZE_DEEP_LINK_USER, initializeDeepLinkUser),
        takeLatest(globalTypes.FETCH_HOME_SCREEN_ARTICLES, getHomeScreenArticles),
    ])
}

export default startupSaga
