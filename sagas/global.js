import { put, call, takeLatest, select, all } from 'redux-saga/effects'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as domainsActions, getSavedDomains } from '../redux/domains'
import { actions as userActions, getApiToken } from '../redux/user'
import { types as adTypes, actions as adActions } from '../redux/ads'

import NavigationService from '../utils/NavigationService'
import api from '../api/api'
import domainApiService from '../api/domain'

import Constants from 'expo-constants'
import { SplashScreen } from 'expo'

import { getReleaseChannel } from '../constants/config'

const version = getReleaseChannel() === 'cns' ? 'college' : 'secondary'

function* fetchAvailableDomains() {
    try {
        yield put(globalActions.fetchAvailableDomainsRequest())
        const apiToken = yield select(getApiToken)

        const response = yield call(api.fetchAvailableDomains, apiToken, version)

        // sort domains
        if (response.length > 0) {
            response.sort(function (a, b) {
                if (a.school < b.school) return -1
                if (a.school > b.school) return 1
                return 0
            })
        }
        if (__DEV__) {
            yield put(globalActions.fetchAvailableDomainsSuccess(response))
        } else {
            const filteredDomains = response.filter((domain) => {
                return !domain.development
            })
            yield put(globalActions.fetchAvailableDomainsSuccess(filteredDomains))
        }
    } catch (err) {
        console.log('error fetching available domains', err, err.response)
        yield put(globalActions.fetchAvailableDomainsError('error fetching avail domains'))
    }
}

function* searchAvailableDomains(action) {
    try {
        yield put(globalActions.searchAvailableDomainsRequest())
        const apiToken = yield select(getApiToken)

        const response = yield call(
            api.searchAvailableDomains,
            apiToken,
            version,
            action.searchTerm
        )

        // sort domains
        if (response.length > 0) {
            response.sort(function (a, b) {
                if (a.school < b.school) return -1
                if (a.school > b.school) return 1
                return 0
            })
        }

        if (__DEV__) {
            yield put(globalActions.searchAvailableDomainsSuccess(response))
        } else {
            const filteredDomains = response.filter((domain) => {
                return !domain.development
            })
            yield put(globalActions.searchAvailableDomainsSuccess(filteredDomains))
        }
    } catch (err) {
        console.log('error in search available domains saga', err)
        yield put(globalActions.searchAvailableDomainsError('error searching available domains'))
    }
}

export function* loadActiveDomain() {
    try {
        yield put(domainsActions.loadActiveDomainRequest())

        const domains = yield select(getSavedDomains)

        const activeDomain = domains.filter((domain) => {
            if (domain.active) {
                return domain
            }
        })
        // sets active domain for app and then navigates to app
        if (activeDomain.length > 0) {
            yield put(domainsActions.setActiveDomain(activeDomain[0].id))
            NavigationService.navigate('App')
        }
        // no active domain navigate to auth
        else {
            SplashScreen.hide()
            NavigationService.navigate('Auth')
        }
        yield put(domainsActions.loadActiveDomainSuccess())
        return
    } catch (err) {
        console.log('error in load active domain saga', err)
        yield put(domainsActions.loadActiveDomainError('error loading active domain'))
        NavigationService.navigate('Auth')
        return
    }
}

function* addSchoolSub(action) {
    try {
        const { url } = action
        yield put(globalActions.addSchoolSubRequest())

        yield call(domainApiService.addSchoolSub, url)

        yield put(globalActions.addSchoolSubSuccess())
    } catch (err) {
        console.log('error in add school sub saga', err)
        yield put(globalActions.addSchoolSubError('error adding school sub'))
    }
}

function* removeSchoolSub(action) {
    try {
        const { url } = action
        yield put(globalActions.removeSchoolSubRequest())

        yield call(domainApiService.removeSchoolSub, url)

        yield put(globalActions.removeSchoolSubSuccess())
    } catch (err) {
        console.log('error in remove school sub saga', err)
        yield put(globalActions.removeSchoolSubError('error removing school sub'))
    }
}

function* addStoryView(action) {
    try {
        const { url, postId } = action
        yield put(globalActions.addStoryViewRequest())

        yield call(domainApiService.addStoryView, url, postId)

        yield put(globalActions.addStoryViewSuccess())
    } catch (err) {
        console.log('error in add story view saga', err)
        yield put(globalActions.addStoryViewError('error adding story view'))
    }
}

function* sendAdAnalytic(action) {
    try {
        const { url, imageId, field } = action
        yield put(adActions.sendAdAnalyticRequest())

        const response = yield call(domainApiService.sendAdAnalytic, url, imageId, field)
        console.log('ad resp', response, imageId)

        yield put(adActions.sendAdAnalyticSuccess())
    } catch (err) {
        console.log('error in send ad analytic saga', err)
        yield put(adActions.sendAdAnalyticError('error adding ad analytic'))
    }
}

function* globalSaga() {
    yield all([
        takeLatest(globalTypes.FETCH_AVAILABLE_DOMAINS, fetchAvailableDomains),
        takeLatest(globalTypes.SEARCH_AVAILABLE_DOMAINS, searchAvailableDomains),
        takeLatest(globalTypes.ADD_SCHOOL_SUB, addSchoolSub),
        takeLatest(globalTypes.REMOVE_SCHOOL_SUB, removeSchoolSub),
        takeLatest(globalTypes.ADD_STORY_VIEW, addStoryView),
        takeLatest(adTypes.SEND_AD_ANALYTIC, sendAdAnalytic),
    ])
}

export default globalSaga
