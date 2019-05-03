import { put, call, takeLatest, all } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, receiveMenus, fetchArticlesIfNeeded, setNotificationCategories } from '../actions/actions';
import { checkNotificationSettings } from './userNotifications';
import { Constants } from 'expo';
const { manifest } = Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
    : `api.example.com`;
// const api = 'mobileapi.snosites.net';
console.log('api', api)

const PUSH_ENDPOINT = `http://${api}/api/token/add`;

function* fetchMenus(action) {
    const { domain, domainId } = action;
    try {
        yield put(requestMenus())
        console.log('domain', domain);
        const response = yield fetch(`${domain}/wp-json/custom/menus/mobile-app-menu`)
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
                yield call(fetch, `http://${api}/api/categories/add`, {
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
            console.log('found old categories', oldCategories)
            //loop through and remove them from DB
            for (let category of oldCategories) {
                yield call(fetch, `http://${api}/api/categories/delete`, {
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
        yield call(checkNotificationSettings);

        const [result, result2, result3] = yield all([
            call(fetch, `${domain}/wp-json/custom/header_image?type=header-image-small`),
            call(fetch, `${domain}/wp-json/custom/header_image?type=mini-logo`),
            call(fetch, `${domain}/wp-json/custom/header_image?type=snomobile-splash-image`),

        ]);
        const headerImage = yield result.json();
        const headerSmall = yield result2.json();
        const splashScreen = yield result3.json();
        yield put(receiveMenus({
            menus,
            header: headerImage.image,
            headerSmall: headerSmall.image,
            splashScreen: splashScreen.image
        }))
        yield put(fetchArticlesIfNeeded({
            domain,
            category: menus[0].object_id,
        }))
    }
    catch (err) {
        console.log('error fetching menus in saga', err)
    }
}

function* fetchCategoriesFromDb(action) {
    try {
        const domainId = action.domainId;
        const response = yield call(fetch, `http://${api}/api/categories/${domainId}`)
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