import { put, call, takeLatest, all, select } from 'redux-saga/effects'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as userActions, getApiToken, getUser } from '../redux/user'
import apiService from '../api/api'
import domainApiService from '../api/domain'

import { fetchMenu } from '../sagas/menu'
import { checkNotificationSettings, subscribe, fetchNotificationSubscriptions } from '../sagas/user'

import { SplashScreen } from 'expo'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

const api = 'mobileapi.snosites.net'
const GET_DOMAIN_BY_ID = `http://${api}/api/domains`

function* startup(action) {
    const { domain } = action
    const apiToken = yield select(getApiToken)
    const user = yield select(getUser)
    // set user domain for analytics
    Amplitude.setUserProperties({
        activeDomain: domain.id
    })
    try {
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
        if (token && user.subscribeAll) {
            yield call(subscribe, {
                domain,
                subscriptionType: 'categories',
                ids: dbCategories.map(category => {
                    return category.id
                })
            })
        }
        // // reset all notifications toggle key
        yield put(userActions.setSubscribeAll(false))

        yield call(fetchNotificationSubscriptions, domain.id)

        // // get user options
        // const [result, result2, result3, result4, result5] = yield all([
        //     call(fetch, `https://${domain}/wp-json/custom/option?type=sns_nav_header`),
        //     call(fetch, `https://${domain}/wp-json/custom/option?type=sns_header_logo`),
        //     call(fetch, `https://${domain}/wp-json/custom/option?type=sns_theme`),
        //     call(fetch, `https://${domain}/wp-json/custom/option?type=sns_primary_color`),
        //     call(fetch, `https://${domain}/wp-json/custom/option?type=sns_accent_color`)
        // ])
        // const headerImageId = yield result.json()
        // const headerSmallId = yield result2.json()
        // const theme = yield result3.json()
        // const primary = yield result4.json()
        // const accent = yield result5.json()

        // // get actual images
        // const [imgResult1, imgResult2] = yield all([
        //     call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${headerImageId.result}`),
        //     call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${headerSmallId.result}`)
        // ])
        // const headerImage = yield imgResult1.json()
        // const headerSmall = yield imgResult2.json()

        // if (!theme.result) {
        //     theme.result = 'light'
        // }
        // if (!primary.result) {
        //     primary.result = '#2099CE'
        //     if (!accent.result) {
        //         accent.result = '#83B33B'
        //     }
        // }

        // yield put(
        //     saveTheme({
        //         theme: theme.result,
        //         primary: primary.result,
        //         accent: accent.result
        //     })
        // )

        // // if image is set otherwise empty string
        // yield put(
        //     receiveMenus({
        //         menus: menus.menus,
        //         header: headerImageId.result ? headerImage[0].source_url : '',
        //         headerSmall: headerSmallId.result ? headerSmall[0].source_url : ''
        //     })
        // )
        // yield put(
        //     fetchArticlesIfNeeded({
        //         domain,
        //         category: menus.menus[0].object_id
        //     })
        // )
        // yield put(initializeSaved(domainId))
    } catch (err) {
        console.log('initilize err', err)
        // clear from push data if any is there
        // yield put(setFromPush(false))
        // const domainCheck = yield call(checkWithDb, domainId, userInfo)
        // console.log('domain check', domainCheck)
        // if (domainCheck.length > 0) {
        //     yield put(setError('initialize-saga error'))
        //     Sentry.captureException(err)
        // } else {
        //     yield put(setError('no school'))
        // }
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

// function* checkWithDb(domainId, userInfo) {
//     const response = yield call(
//         fetch,
//         `${GET_DOMAIN_BY_ID}/${domainId}?api_token=${userInfo.apiKey}`
//     )
//     const dbDomain = yield response.json()
//     return dbDomain
// }

function* startupSaga() {
    yield takeLatest(globalTypes.STARTUP, startup)
}

export default startupSaga
