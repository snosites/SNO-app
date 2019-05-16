import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, receiveMenus, fetchArticlesIfNeeded, setNotificationCategories, saveTheme, setError, initializeSaved, fetchNotifications, setAllNotifications } from '../actions/actions';
import { checkNotificationSettings, addAllNotifications } from './userNotifications';
import { Constants } from 'expo';
const { manifest } = Constants;

import Sentry from 'sentry-expo';

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//     ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
//     : `api.example.com`;
const api = 'mobileapi.snosites.net/';

function* initialize(action) {

}



function* initializationSaga() {
    yield takeLatest('INITIALIZE', initialize);
}

export default initializationSaga;