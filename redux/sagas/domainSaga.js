import { put, call, takeLatest, select } from 'redux-saga/effects';
import { setAvailableDomains, setError } from '../actionCreators';
import { Constants } from 'expo';

import Sentry from 'sentry-expo';

const api = 'mobileapi.snosites.net';
const getUserInfo = state => state.userInfo

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
function* fetchAvailableDomains(action){
    try {
        let version = '';
        if (Constants.manifest.releaseChannel === 'sns') {
            version = 'secondary';
        } else {
            version = 'college';
        }
        const userInfo = yield select(getUserInfo)
        console.log('user info', userInfo)
        const response = yield call(fetch, `http://${api}/api/domains/all/${version}?api_token=${userInfo.apiKey}`);
        console.log('response', response)
        const availDomains = yield response.json();
        // sort domains
        availDomains.sort(function (a, b) {
            if (a.school < b.school)
                return -1;
            if (a.school > b.school)
                return 1;
            return 0;
        })
        if(__DEV__) {
            yield put(setAvailableDomains(availDomains));
        } else {
            const filteredDomains = availDomains.filter(domain => {
                return !domain.development
            })
            yield put(setAvailableDomains(filteredDomains));
        }
    }
    catch(err) {
        console.log('error fetching available domains', err)
        Sentry.captureException(err)
        yield put(setError('api-domains error'))
    }
}

function* searchAvailableDomains(action) {
    try {
        let version = '';
        if (Constants.manifest.releaseChannel === 'sns') {
            version = 'secondary';
        } else {
            version = 'college';
        }
        const userInfo = yield select(getUserInfo)
        console.log('user info', userInfo)
        const response = yield call(fetch, `http://${api}/api/domains/search/${action.searchTerm}/${version}?api_token=${userInfo.apiKey}`);
        const availDomains = yield response.json();
        yield put(setAvailableDomains(availDomains));
    }
    catch(err) {
        console.log('error fetching available domains', err)
    }
}

function* domainSaga() {
    yield takeLatest('FETCH_AVAILABLE_DOMAINS', fetchAvailableDomains);
    yield takeLatest('SEARCH_AVAILABLE_DOMAINS', searchAvailableDomains);

}

export default domainSaga;