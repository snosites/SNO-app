import { put, call, takeLatest, select } from 'redux-saga/effects';
import { 
    requestMenus, 
    setNotificationCategories,
    setError
 } from '../actionCreators';

import Sentry from 'sentry-expo';


const api = 'mobileapi.snosites.net/';
const getUserInfo = state => state.userInfo

export function* fetchMenus(action) {
    const { domain, domainId } = action;
    const userInfo = yield select(getUserInfo);
    try {
        
        yield put(requestMenus())
        const response = yield fetch(`https://${domain}/wp-json/custom/menus/mobile-app-menu`)
        const originalMenus = yield response.json();
        console.log('menus', originalMenus)
        if(response.status !== 200 || typeof originalMenus != 'object'){
            throw new Error('REST API issue fetching menus, possibly no route')
        }
        
        //filter out all menu items that are custom
        let menus = originalMenus.filter(menu => {
            if(menu.object !== 'custom') {
                return menu
            }
        })
        // get categories from DB
        const {dbCategories, err} = yield call(fetchCategoriesFromDb, {
            domainId
        })
        if(err){
            throw new Error('error getting categories from DB');
        }
        //loop through and check if category of menu is in DB -- if not then add it
        for (let menu of menus) {
            let foundCategory = dbCategories.find((category) => {
                return Number(menu.object_id) === category.category_id
            })
            if (!foundCategory && menu.object_id) {
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
        // check if "custom push" category has been added
        let foundCustom = dbCategories.find((category) => {
            return  category.category_name === 'custom_push'
        })
        if(!foundCustom) {
            console.log('adding custom push category category')
            yield call(fetch, `http://${api}/api/categories/add?api_token=${userInfo.apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // category: menu.object_id,
                    domain: domainId,
                    categoryName: 'custom_push'
                }),
            })
        }
        
        //check for any old categories -- ignore custom push category
        let oldCategories = dbCategories.filter((dbCategory) => {
            if(dbCategory.category_name === 'custom_push'){
                return false;
            }
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
        const dbCategoriesObj = yield call(fetchCategoriesFromDb, {
            domainId
        })
        if (dbCategoriesObj.err) {
            throw new Error('error getting updated categories from DB');
        }
        const updatedDbCategories = dbCategoriesObj.dbCategories;
        // make sure there is at least one menu
        if(updatedDbCategories.length === 0) {
            throw new Error('no menus in DB for school')
        }
        yield put(setNotificationCategories({
            id: domainId,
            notificationCategories: updatedDbCategories
        }))

        return {
            menus: {
                menus,
                DbCategories: updatedDbCategories
            }
        }
    }
    catch (err) {
        console.log('error fetching menus in saga', err)
        return {
            err
        }
    }
}

function* fetchCategoriesFromDb(action) {
    try {
        const domainId = action.domainId;
        const userInfo = yield select(getUserInfo)
        const response = yield call(fetch, `http://${api}/api/categories/${domainId}?api_token=${userInfo.apiKey}`)
        const dbCategories = yield response.json();
        if(response.status == 200){
            return {
                dbCategories
            }
        } else {
            throw new Error('error fetching categories from DB')
        }
    }
    catch (err) {
        console.log('error fetching categories from DB', err)
        return {
            err
        }
    }
}


function* menuSaga() {
    yield takeLatest('FETCH_MENUS', fetchMenus);
    yield takeLatest('FETCH_CATEGORIES_FROM_DB', fetchCategoriesFromDb);
}

export default menuSaga;