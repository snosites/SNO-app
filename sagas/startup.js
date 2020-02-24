import { put, call, takeLatest, all, select } from 'redux-saga/effects'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as userActions, getApiToken, getSubscribeAll, getFromPush } from '../redux/user'
import { actions as themeActions } from '../redux/theme'
import { actions as articleActions } from '../redux/articles'
import { actions as savedArticleActions } from '../redux/savedArticles'

import { fetchMenu } from '../sagas/menu'
import {
    checkNotificationSettings,
    subscribe,
    fetchNotificationSubscriptions,
    findOrCreateUser
} from '../sagas/user'
import { loadActiveDomain } from '../sagas/global'

import domainApiService from '../api/domain'
import apiService from '../api/api'

import NavigationService from '../utils/NavigationService'
import { handleArticlePress } from '../utils/articlePress'

import { SplashScreen } from 'expo'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

function* startup(action) {
    const { domain } = action
    const userSubscribeAll = yield select(getSubscribeAll)
    const fromPush = yield select(getFromPush)
    try {
        // set user domain for analytics
        Amplitude.setUserProperties({
            activeDomain: domain.id
        })

        console.log('in startup')

        yield put(globalActions.startupRequest())
        // get splash image right away
        const splashScreenUrl = yield call(getSplashScreenImage, domain)
        yield put(globalActions.receiveSplash(splashScreenUrl))
        SplashScreen.hide()

        // get menus and sync with DB -- save updated DB categories to push notification categories -- return obj with menu and DB categories
        const { menu, dbCategories } = yield call(fetchMenu, {
            domain
        })

        // // make sure push token has been stored
        const token = yield call(checkNotificationSettings)

        // // check if user selected all notifications
        if (token && userSubscribeAll) {
            yield call(subscribe, {
                payload: {
                    subscriptionType: 'categories',
                    domainId: domain.id,
                    ids: dbCategories.map(category => {
                        return category.id
                    })
                }
            })
        }
        // // reset all notifications toggle key
        yield put(userActions.setSubscribeAll(false))

        // get users notification subscriptions
        yield call(fetchNotificationSubscriptions, domain.id)

        //get domains custom options
        yield call(getCustomOptions, domain)

        let mainCategory = menu[0].object_id

        yield put(
            articleActions.fetchArticlesIfNeeded({
                domain: domain.url,
                category: mainCategory
            })
        )
        yield put(savedArticleActions.initializeSaved(domain.id))

        if (fromPush) {
            // go to main app
            NavigationService.nestedNavigate('MainApp', 'RecentStack')

            yield call(handleArticlePress, fromPush, domain)
            // reset push key
            yield put(userActions.setFromPush(false))
        } else {
            NavigationService.navigate('MainApp')
        }

        yield put(globalActions.startupSuccess())
    } catch (err) {
        console.log('initilize err', err)
        // clear from push data if any is there
        yield put(userActions.setFromPush(false))

        // check if domain is still in DB
        const domainCheck = yield call(checkIfDomainIsInDb, domain.id)

        if (domainCheck.length > 0) {
            yield put(globalActions.startupError('error initializing app'))
            Sentry.captureException(err)
        } else {
            yield put(globalActions.startupError('school not in DB'))
        }
    }
}

function* getCustomOptions(domain) {
    try {
        // // get user options
        const [headerImage, headerLogo, theme, primary, accent, comments] = yield all([
            call(domainApiService.getCustomHeader, domain.url),
            call(domainApiService.getCustomHeaderLogo, domain.url),
            call(domainApiService.getCustomTheme, domain.url),
            call(domainApiService.getCustomPrimaryColor, domain.url),
            call(domainApiService.getCustomAccentColor, domain.url),
            call(domainApiService.getCommentsToggle, domain.url)
        ])

        console.log('comments toggle', comments)

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
                accent: accent.result
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
                accent: '#83B33B'
            })
        )
        yield put(globalActions.receiveHeader(''))
        yield put(globalActions.receiveHeaderLogo(''))
        yield put(globalActions.receiveSportCenterOption(false))
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

function* initializeUser() {
    try {
        yield put(globalActions.initializeUserRequest())

        yield call(findOrCreateUser)
        yield call(loadActiveDomain)

        yield put(globalActions.initializeUserSuccess())
    } catch (err) {
        console.log('error initializing user in saga', err)
        yield put(globalActions.initializeUserError('error initializing user'))
    }
}

function* startupSaga() {
    yield all([
        takeLatest(globalTypes.STARTUP, startup),
        takeLatest(globalTypes.INITIALIZE_USER, initializeUser)
    ])
}

export default startupSaga