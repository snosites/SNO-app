import { put, call, takeLatest, select } from 'redux-saga/effects';
import { 
    requestMenus, 
    setNotificationCategories,
    setError
 } from '../actions/actions';

import Sentry from 'sentry-expo';


const api = 'mobileapi.snosites.net/';
const getUserInfo = state => state.userInfo

export function* fetchMenus(action) {
    const { domain, domainId } = action;
    const userInfo = yield select(getUserInfo);
    try {
        
        yield put(requestMenus())
        const response = yield fetch(`https://${domain}/wp-json/custom/menus/mobile-app-menuxxx`)
        console.log('resp', response)
        const originalMenus = yield response.json();

        //filter out all menu items that are custom
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
        if (oldCategories.length > 0) {
            //create array of category ID's to remove
            let categoriesToDelete = oldCategories.map(category => {
                return category.id;
            })
            //remove them
            yield call(fetch, `http://${api}/api/categories/delete?api_token=${userInfo.apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    categoriesId: categoriesToDelete,
                }),
            })
        }
        // fetch updated categories list
        const updatedDbCategories = yield call(fetchCategoriesFromDb, {
            domainId
        })
        yield put(setNotificationCategories({
            id: domainId,
            notificationCategories: updatedDbCategories
        }))

        return {
            menus,
            DbCategories: updatedDbCategories
        }
    }
    catch (err) {
        console.log('error fetching menus in saga', err)
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