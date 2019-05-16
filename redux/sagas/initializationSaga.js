import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { 
    receiveMenus, 
    fetchArticlesIfNeeded, 
    saveTheme, 
    setError, 
    initializeSaved, 
    fetchNotifications, 
    setAllNotifications 
} from '../actions/actions';

import { checkNotificationSettings, addAllNotifications } from './userNotifications';
import { fetchMenus } from './menuSaga';

import Sentry from 'sentry-expo';

function* initialize(action) {
    const { domain, domainId } = action;
    try {
        // get menus and sync with DB -- save updated DB categories to push notification categories -- return obj with menus and DB categories
        const menus = yield call(fetchMenus, {
            domain,
            domainId
        })

        // make sure push token has been stored
        const token = yield call(checkNotificationSettings);
        // check if user selected all notifications
        if (userInfo.allNotifications[domainId]) {
            console.log('adding all notifications...')
            yield call(addAllNotifications, {
                payload: {
                    tokenId: token,
                    categoryIds: menus.DbCategories.map(category => {
                        return category.id
                    })
                }
            })
            // reset all notifications toggle key
            yield put(setAllNotifications(domainId, false))
        }
        yield put(fetchNotifications({
            tokenId: token,
            domain: domainId
        }))
        // get user options
        const [result, result2, result3, result4, result5, result6] = yield all([
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_nav_header`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_header_logo`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_splash_screen`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_theme`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_primary_color`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_accent_color`),

        ]);
        const headerImageId = yield result.json();
        const headerSmallId = yield result2.json();
        const splashScreenId = yield result3.json();
        const theme = yield result4.json();
        const primary = yield result5.json();
        const accent = yield result6.json();

        // get actual images
        const [imgResult1, imgResult2, imgResult3] = yield all(
            [
                call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${headerImageId.result}`),
                call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${headerSmallId.result}`),
                call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${splashScreenId.result}`),
            ]
        );

        const headerImage = yield imgResult1.json();
        const headerSmall = yield imgResult2.json();
        const splashScreen = yield imgResult3.json();

        if (!theme.result) {
            theme.result = 'light';
        }
        if (!primary.result) {
            primary.result = '#2099CE';
            if (!accent.result) {
                accent.result = '#83B33B';
            }
        }

        yield put(saveTheme({
            theme: theme.result,
            primary: primary.result,
            accent: accent.result
        }))

        // if image is set otherwise empty string
        yield put(receiveMenus({
            menus,
            header: headerImageId.result ? headerImage[0].source_url : '',
            headerSmall: headerSmallId.result ? headerSmall[0].source_url : '',
            splashScreen: splashScreenId.result ? splashScreen[0].source_url : '',
        }))
        yield put(fetchArticlesIfNeeded({
            domain,
            category: menus[0].object_id,
        }))
        yield put(initializeSaved(
            domainId
        ))
    }
    catch(err) {
        console.log('error initializing in saga', err)
        yield put(setError('initialize-saga error'))
        Sentry.captureException(err)
    }
}



function* initializationSaga() {
    yield takeLatest('INITIALIZE', initialize);
}

export default initializationSaga;