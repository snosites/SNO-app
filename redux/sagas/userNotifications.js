import { put, call, takeLatest, all } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus } from '../actions/actions';

import { Constants } from 'expo';
const { manifest } = Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
    : `api.example.com`;

function* addNotification(action) {
    
}

function* fetchNotifications(action) {
    try {
        const domainId = action.domainId;
        console.log('domain ID', domainId, api)
        const response = yield call(fetch, `http://${api}/api/categories/${domainId}`)
        const categories = yield response.json();
        return categories;
    }
    catch (err) {
        console.log('error fetching categories fromm DB', err)
    }
}

function* notificationsSaga() {
    yield takeLatest('FETCH_NOTIFICATIONS', fetchNotifications);

}

export default notificationsSaga;