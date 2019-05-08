import { put, call, takeLatest, all } from 'redux-saga/effects';
import { requestProfiles, receiveProfiles, fetchArticlesIfNeeded } from '../actions/actions';

function* fetchProfiles(action){
    const { domain } = action;
    try {
        yield put(requestProfiles())
        const response = yield fetch(`https://${domain}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=name`)
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