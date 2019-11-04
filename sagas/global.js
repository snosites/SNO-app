import { put, call, takeLatest, select, all } from 'redux-saga/effects'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getApiToken } from '../redux/user'

import api from '../api/api'

import Constants from 'expo-constants'

import * as Sentry from 'sentry-expo'


const version = Constants.manifest.releaseChannel === 'cns' ? 'college' : 'secondary'

// city: "St. Louis Park"
// development: null
// domain_id: 40316786
// id: 33
// latitude: "44.959700"
// level: "secondary"
// longitude: "-93.370200"
// publication: "Knight Errant"
// school: "Benilde-St. Margaret's School"
// state: "MN"
// url: "bsmknighterrant.org"
// zip: 55416
function* fetchAvailableDomains() {
    try {
        yield put(globalActions.fetchAvailableDomainsRequest())
        const apiToken = yield select(getApiToken)

        const response = yield call(api.fetchAvailableDomains, apiToken, version)

        // sort domains
        if (response.length > 0) {
            response.sort(function(a, b) {
                if (a.school < b.school) return -1
                if (a.school > b.school) return 1
                return 0
            })
        }
        if (__DEV__) {
            yield put(globalActions.fetchAvailableDomainsSuccess(response))
        } else {
            const filteredDomains = response.filter(domain => {
                return !domain.development
            })
            yield put(globalActions.fetchAvailableDomainsSuccess(filteredDomains))
        }
    } catch (err) {
        console.log('error fetching available domains', err, err.response)
        yield put(globalActions.fetchAvailableDomainsError('error fetching avail domains'))
    }
}

// function* searchAvailableDomains(action) {
//     try {
//         let version = ''
//         if (Constants.manifest.releaseChannel === 'sns') {
//             version = 'secondary'
//         } else {
//             version = 'college'
//         }
//         const userInfo = yield select(getUserInfo)
//         console.log('user info', userInfo)
//         const response = yield call(
//             fetch,
//             `http://${api}/api/domains/search/${action.searchTerm}/${version}?api_token=${userInfo.apiKey}`
//         )
//         const availDomains = yield response.json()
//         yield put(setAvailableDomains(availDomains))
//     } catch (err) {
//         console.log('error fetching available domains', err)
//     }
// }

function* globalSaga() {
    yield all([
        takeLatest(globalTypes.FETCH_AVAILABLE_DOMAINS, fetchAvailableDomains),
        // takeLatest('SEARCH_AVAILABLE_DOMAINS', searchAvailableDomains)
    ])
}

export default globalSaga
