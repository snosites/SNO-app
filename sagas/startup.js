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
import Constants from 'expo-constants'

import * as SplashScreen from 'expo-splash-screen'

async function hideSplashScreen() {
    await SplashScreen.hideAsync()
}

function* initializeUser() {
    try {
        yield put(globalActions.initializeUserRequest())

        yield call(findOrCreateUser)
        // yield call(loadActiveDomain)

        yield put(globalActions.initializeUserSuccess())
        yield call(hideSplashScreen)
    } catch (err) {
        console.log('error initializing user in saga', err)
        yield put(globalActions.initializeUserError('error initializing user'))
    }
}

function* loadActiveDomain() {
    try {
        yield put(domainsActions.loadActiveDomainRequest())

        const domains = yield select(getSavedDomains)

        const activeDomain = domains.filter((domain) => {
            if (domain.active) {
                return domain
            }
        })
        // sets active domain for app
        if (activeDomain.length) {
            yield put(domainsActions.setActiveDomain(activeDomain[0].id))
        }
        // no active domain navigate to auth
        else {
            console.log('no active domain', activeDomain)
            yield call(SplashScreen.hideAsync)
            return

            // NavigationService.navigate('Auth')
        }
        yield put(domainsActions.loadActiveDomainSuccess())
        return
    } catch (err) {
        console.log('error in load active domain saga', err)
        yield put(domainsActions.loadActiveDomainError('error loading active domain'))
        // NavigationService.navigate('Auth')
        return
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
        // yield call(SplashScreen.hideAsync)
        // SplashScreen.hide()

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

        yield call(getHomeScreenArticles)

        let mainCategory = menu[0].object_id

        yield put(
            articleActions.fetchArticlesIfNeeded({
                domain: domain.url,
                category: mainCategory,
            })
        )

        yield put(globalActions.setActiveCategory(mainCategory))

        yield put(savedArticleActions.initializeSaved(domain.id))

        throw new Error()

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
        console.log('startup saga err', err)
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
        //get home page options
        const [
            headerImage,
            headerLogo,
            theme,
            primary,
            accent,
            comments,
            listStyle,
            appAdOptions,
        ] = yield all([
            call(domainApiService.getCustomHeader, domain.url),
            call(domainApiService.getCustomHeaderLogo, domain.url),
            call(domainApiService.getCustomTheme, domain.url),
            call(domainApiService.getCustomPrimaryColor, domain.url),
            call(domainApiService.getCustomAccentColor, domain.url),
            call(domainApiService.getCommentsToggle, domain.url),
            call(domainApiService.getStoryListStyle, domain.url),
            call(domainApiService.getAdOptions, domain.url),
        ])

        //home screen categories
        const [
            category1,
            category2,
            category3,
            category1Amount,
            category2Amount,
            category3Amount,
            homeScreenListStyle,
            homeScreenMode,
            homeScreenCategoryColor,
        ] = yield all([
            call(domainApiService.getHomeScreenCategory, domain.url, 1),
            call(domainApiService.getHomeScreenCategory, domain.url, 2),
            call(domainApiService.getHomeScreenCategory, domain.url, 3),
            call(domainApiService.getHomeScreenCategoryAmount, domain.url, 1),
            call(domainApiService.getHomeScreenCategoryAmount, domain.url, 2),
            call(domainApiService.getHomeScreenCategoryAmount, domain.url, 3),
            call(domainApiService.getHomeScreenListStyle, domain.url),
            call(domainApiService.getHomeScreenMode, domain.url),
            call(domainApiService.getCustomHomeCategoryColor, domain.url),
        ])

        if (homeScreenMode.result == 1 || homeScreenMode.result == '1') {
            yield put(globalActions.receiveHomeScreenMode('legacy'))
        } else {
            yield put(globalActions.receiveHomeScreenMode('categories'))
        }

        const homeScreenCategories = []

        if (!category1.result) {
        } else {
            homeScreenCategories.push(Number(category1.result))
        }
        if (!category2.result) {
        } else {
            homeScreenCategories.push(Number(category2.result))
        }
        if (!category3.result) {
        } else {
            homeScreenCategories.push(Number(category3.result))
        }

        const homeScreenCategoryAmounts = []

        if (!category1Amount.result) {
            homeScreenCategoryAmounts.push(5)
        } else {
            homeScreenCategoryAmounts.push(Number(category1Amount.result))
        }
        if (!category2Amount.result) {
            homeScreenCategoryAmounts.push(5)
        } else {
            homeScreenCategoryAmounts.push(Number(category2Amount.result))
        }
        if (!category3Amount.result) {
            homeScreenCategoryAmounts.push(5)
        } else {
            homeScreenCategoryAmounts.push(Number(category3Amount.result))
        }

        if (!homeScreenCategoryColor.result) {
            homeScreenCategoryColor.result = null
        }

        yield put(globalActions.receiveAppAdOptions(appAdOptions))

        yield fork(fetchAds, domain, appAdOptions)

        yield put(globalActions.receiveHomeScreenCategoryColor(homeScreenCategoryColor.result))

        yield put(globalActions.receiveHomeScreenCategories(homeScreenCategories))
        yield put(globalActions.receiveHomeScreenCategoryAmounts(homeScreenCategoryAmounts))

        yield put(
            globalActions.receiveHomeScreenListStyle(
                homeScreenListStyle.result === 'small' ||
                    homeScreenListStyle.result === 'large' ||
                    homeScreenListStyle.result === 'mix' ||
                    homeScreenListStyle.result === 'alternating'
                    ? homeScreenListStyle.result
                    : 'small'
            )
        )

        if (!theme.result) {
            theme.result = 'light'
        }
        if (!primary.result) {
            primary.result = '#2099CE'
        }
        if (!accent.result) {
            accent.result = '#83B33B'
        }

        yield put(
            themeActions.saveTheme({
                theme: theme.result,
                primary: primary.result,
                accent: accent.result,
            })
        )
        // // save if images are set otherwise empty string
        yield put(
            globalActions.receiveHeader(
                headerImage[0] && headerImage[0].source_url ? headerImage[0].source_url : ''
            )
        )
        yield put(
            globalActions.receiveHeaderLogo(
                headerLogo[0] && headerLogo[0].source_url ? headerLogo[0].source_url : ''
            )
        )
        yield put(globalActions.receiveCommentsOption(comments.result === 'Enable' ? true : false))

        yield put(
            globalActions.receiveStoryListStyle(
                listStyle.result === 'small' ||
                    listStyle.result === 'large' ||
                    listStyle.result === 'mix' ||
                    listStyle.result === 'alternating'
                    ? listStyle.result
                    : 'small'
            )
        )

        try {
            // save sportcenter option
            const sportCenter = yield call(domainApiService.getSportCenterOption, domain.url)
            yield put(globalActions.receiveSportCenterOption(sportCenter))
        } catch (err) {
            yield put(globalActions.receiveSportCenterOption(false))
        }
    } catch (err) {
        console.log('error in get custom domain options saga', err)
        // default options for theme
        yield put(
            themeActions.saveTheme({
                theme: 'light',
                primary: '#2099CE',
                accent: '#83B33B',
            })
        )
        yield put(globalActions.receiveHeader(''))
        yield put(globalActions.receiveHeaderLogo(''))
        yield put(globalActions.receiveSportCenterOption(false))
        yield put(globalActions.receiveStoryListStyle('small'))
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
