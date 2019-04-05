import { put, call, takeLatest } from 'redux-saga/effects';
import {AsyncStorage} from 'react-native';
import { setDomains } from '../actions/actions';

function* fetchDomains(action){
    try {
        const savedDomains = yield call(AsyncStorage.getItem, 'userDomain');
        yield console.log('storage', savedDomains)
        yield put(setDomains(savedDomains));
    }
    catch(err) {
        console.log('error fetching saved domains from storage')
    }
}

function* domainSaga() {
    yield takeLatest('FETCH_DOMAINS', fetchDomains);

}

export default domainSaga;