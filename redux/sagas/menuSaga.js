import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, receiveMenus, fetchArticlesIfNeeded, setNotificationCategories, saveTheme, setError, initializeSaved, fetchNotifications, setAllNotifications } from '../actions/actions';
import { checkNotificationSettings, addAllNotifications } from './userNotifications';
import { Constants } from 'expo';
const { manifest } = Constants;

import Sentry from 'sentry-expo';

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//     ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
//     : `api.example.com`;
const api = 'mobileapi.snosites.net/';

const getUserInfo = state => state.userInfo

function* fetchMenus(action) {
    const { domain, domainId } = action;
    const userInfo = yield select(getUserInfo);
    console.log('user info', userInfo)
    try {
        
        yield put(requestMenus())
        const response = yield fetch(`https://${domain}/wp-json/custom/menus/mobile-app-menu`)
        console.log('resp', response)
        const originalMenus = yield response.json();

        let menus = originalMenus.filter(menu => {
            if(menu.object !== 'custom') {
                return menu
            }
        })
        // get categories from DB
        const dbCategories = yield call(fetchCategoriesFromDb, {
            domainId
        })
        //loop through and check if category of menu is in DB -- if not then add it
        for (let menu of menus) {
            let foundCategory = dbCategories.find((category) => {
                return Number(menu.object_id) === category.category_id
            })
            if (!foundCategory) {
                console.log('adding new category', menu.object_id)
                yield call(fetch, `http://${api}/api/categories/add?api_token=${userInfo.apiKey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: menu.object_id,
                        domain: domainId,
                        categoryName: menu.title
                    }),
                })
            }
        }
        //check for any old categories
        let oldCategories = dbCategories.filter((dbCategory) => {
            return !menus.find(menuItem => {
                return Number(menuItem.object_id) === dbCategory.category_id;
            })
        })
        //if any are found
        // optimize later into one fetch call
        if (oldCategories.length > 0) {
            //loop through and remove them from DB
            for (let category of oldCategories) {
                yield call(fetch, `http://${api}/api/categories/delete?api_token=${userInfo.apiKey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        categoriesId: category.id,
                    }),
                })
            }
        }
        // fetch updated categories list
        const updatedDbCategories = yield call(fetchCategoriesFromDb, {
            domainId
        })
        yield put(setNotificationCategories({
            id: domainId,
            notificationCategories: updatedDbCategories
        }))
        
        // make sure push token has been stored
        const token = yield call(checkNotificationSettings);
        // check if user selected all notifications
        if(userInfo.allNotifications[domainId]) {
            console.log('adding all notifications...')
            yield call(addAllNotifications, {
                payload: {
                    tokenId: token, 
                    categoryIds: updatedDbCategories.map(category => {
                        return category.id
                    })
                }
            })
            yield put(setAllNotifications(domainId, false))
        }
        console.log('made it here', token, domainId)
        yield put(fetchNotifications({
            tokenId: token,
            domain: domainId
        }))
        const [result, result2, result3, result4, result5, result6] = yield all([
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_nav_header`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_header_logo`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_splash_screen`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_theme`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_primary_color`),
            call(fetch, `https://${domain}/wp-json/custom/option?type=sns_accent_color`),

        ]);
        const headerImageId = yield result.json();
        console.log('header img id', headerImageId)
        const headerSmallId = yield result2.json();
        const splashScreenId = yield result3.json();
        const theme = yield result4.json();
        const primary = yield result5.json();
        const accent = yield result6.json();

        // get actual images
        const [imgResult1, imgResult2, imgResult3 ] = yield all(
            [
                call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${headerImageId.result}`),
                call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${headerSmallId.result}`),
                call(fetch, `https://${domain}/wp-json/wp/v2/media?include=${splashScreenId.result}`),
            ]
        );

        const headerImage = yield imgResult1.json();
        const headerSmall = yield imgResult2.json();
        const splashScreen = yield imgResult3.json();

        if(!theme.result){
            theme.result = 'light';
        }
        if(!primary.result){
            // const response = yield call(fetch, `https://${domain}/wp-json/custom/theme-mod?type=accentcolor-links`);
            // const colorFallback = yield response.json();
            // primary.image = colorFallback.image;
            primary.result = '#2099CE';
            if(!accent.result){
                accent.result = '#83B33B';
            }
        }
        
        yield put(saveTheme({
            theme: theme.result,
            primary: primary.result,
            accent: accent.result
        }))

        // if image set otherwise empty string
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
    catch (err) {
        console.log('error fetching menus in saga', err)
        yield put(setError('menu-saga error'))
        Sentry.captureException(err)
    }
}

function* fetchCategoriesFromDb(action) {
    try {
        const domainId = action.domainId;
        const userInfo = yield select(getUserInfo)
        const response = yield call(fetch, `http://${api}/api/categories/${domainId}?api_token=${userInfo.apiKey}`)
        const categories = yield response.json();
        return categories;
    }
    catch (err) {
        console.log('error fetching categories from DB', err)
    }
}



function* menuSaga() {
    yield takeLatest('FETCH_MENUS', fetchMenus);
    yield takeLatest('FETCH_CATEGORIES_FROM_DB', fetchCategoriesFromDb);
}

export default menuSaga;