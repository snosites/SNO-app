import { put, call, takeLatest, select } from 'redux-saga/effects';
import { setAvailableDomains } from '../actions/actions';

const api = 'mobileapi.snosites.net';
const getUserInfo = state => state.userInfo

function* fetchAvailableDomains(action){
    try {
        const userInfo = yield select(getUserInfo)
        console.log('user info', userInfo)
        const response = yield call(fetch, `http://${api}/api/domains/all?api_token=${userInfo.apiKey}`);
        console.log('response', response)
        const availDomains = yield response.json();
        yield put(setAvailableDomains(availDomains));
    }
    catch(err) {
        console.log('error fetching available domains', err)
    }
}

function* searchAvailableDomains(action) {
    try {
        const userInfo = yield select(getUserInfo)
        console.log('user info', userInfo)
        const response = yield call(fetch, `http://${api}/api/domains/search/${action.searchTerm}?api_token=${userInfo.apiKey}`);
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