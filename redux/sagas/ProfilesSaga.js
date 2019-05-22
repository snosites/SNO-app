import { put, call, takeLatest, all } from 'redux-saga/effects';
import { requestProfiles, receiveProfiles, fetchArticlesIfNeeded } from '../actionCreators';

function* fetchProfiles(action){
    const { domain, year } = action;
    try {
        yield put(requestProfiles())
        const response = yield fetch(`https://${domain}/wp-json/sns-v2/get_profiles?year=${year}`)
        const profiles = yield response.json();
        yield put(receiveProfiles(profiles))
        
    }
    catch(err) {
        console.log('error fetching profiles in saga', err)
    }
}

function* profilesSaga() {
    yield takeLatest('FETCH_PROFILES', fetchProfiles);
}

export default profilesSaga;