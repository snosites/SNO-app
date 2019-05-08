import { put, call, takeLatest } from 'redux-saga/effects';
import { setAvailableDomains } from '../actions/actions';

const api = 'mobileapi.snosites.net';

function* fetchAvailableDomains(action){
    try {
        const response = yield call(fetch, `http://${api}/api/domains/all`);
        const availDomains = yield response.json();
        yield put(setAvailableDomains(availDomains));
    }
    catch(err) {
        console.log('error fetching available domains from storage')
    }
}

function* searchAvailableDomains(action) {
    try {
        const response = yield call(fetch, `http://${api}/api/domains/search/${action.searchTerm}`);
        const availDomains = yield response.json();
        yield put(setAvailableDomains(availDomains));
    }
    catch(err) {
        console.log('error fetching available domains from storage')
    }
}

function* domainSaga() {
    yield takeLatest('FETCH_AVAILABLE_DOMAINS', fetchAvailableDomains);
    yield takeLatest('SEARCH_AVAILABLE_DOMAINS', searchAvailableDomains);

}

export default domainSaga;