import { put, call, takeLatest, select } from 'redux-saga/effects'

import { getApiToken } from '../redux/user'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as domainsActions } from '../redux/domains'
import apiService from '../api/api'
import domainApiService from '../api/domain'

import * as Sentry from 'sentry-expo'

const api = 'mobileapi.snosites.net'

export function* fetchMenu(action) {
    try {
        const { domain } = action
        yield put(globalActions.fetchMenusRequest())
        const apiToken = yield select(getApiToken)

        const mobileMenu = yield call(domainApiService.getMobileMenu, domain.url)

        //filter out all menu items that are custom
        let filteredMobileMenu = mobileMenu.filter(menu => {
            if (menu.object !== 'custom') {
                return menu
            }
        })

        // get categories from DB
        const dbCategories = yield call(fetchCategoriesFromDb, apiToken, domain.id)

        yield call(syncDbCategories, dbCategories, filteredMobileMenu, domain)

        // fetch updated categories list
        const updatedDbCategories = yield call(fetchCategoriesFromDb, apiToken, domain.id)

        console.log('updated db categories', updatedDbCategories)
        // // make sure there is at least one menu
        if (updatedDbCategories.length === 0) {
            throw new Error('no menus in DB for school')
        }
        yield put(domainsActions.setNotificationCategories(domain.id, updatedDbCategories))

        return {
            menu: filteredMobileMenu,
            dbCategories: updatedDbCategories
        }
    } catch (err) {
        console.log('error fetching menus in saga', err)
        throw err
    }
}

function* syncDbCategories(dbCategories, mobileMenu, domain) {
    try {
        const apiToken = yield select(getApiToken)
        //loop through and check if category of menu is in DB -- if not then add it
        for (let menu of mobileMenu) {
            let foundCategory = dbCategories.find(category => {
                return Number(menu.object_id) === category.category_id
            })
            if (!foundCategory && menu.object_id) {
                const postObj = {
                    categoryId: menu.object_id,
                    organizationId: domain.id,
                    categoryName: menu.title
                }
                yield call(domainApiService.addDbCategory, apiToken, postObj)
            }
        }
        // check if "custom push" category has been added
        let foundCustom = dbCategories.find(category => {
            return category.category_name === 'custom_push'
        })
        if (!foundCustom) {
            //add custom push category
            const postObj = {
                organizationId: domain.id,
                categoryName: 'custom_push'
            }
            yield call(domainApiService.addDbCategory, apiToken, postObj)
        }

        //check for any old categories -- ignore custom push category
        let oldCategories = dbCategories.filter(dbCategory => {
            if (dbCategory.category_name === 'custom_push') {
                return false
            }
            return !mobileMenu.find(menuItem => {
                return Number(menuItem.object_id) === dbCategory.category_id
            })
        })
        //if any are found
        if (oldCategories.length > 0) {
            //create array of category ID's to remove
            const categoriesToDelete = oldCategories.map(category => {
                return category.id
            })
            //remove them
            yield call(domainApiService.deleteDbCategories, {
                categoryIds: categoriesToDelete
            })
        }
        console.log('sync successful')
        return
    } catch (err) {
        console.log('error syncing DB categories with mobile menu', err)
        throw err
    }
}

function* fetchCategoriesFromDb(apiToken, domainId) {
    try {
        const dbCategories = yield call(domainApiService.getDbCategories, apiToken, domainId)

        return dbCategories
    } catch (err) {
        console.log('error fetching categories from DB', err)
        throw err
    }
}

function* menuSaga() {
    yield takeLatest('FETCH_MENUS', fetchMenus)
    yield takeLatest('FETCH_CATEGORIES_FROM_DB', fetchCategoriesFromDb)
}

export default menuSaga
