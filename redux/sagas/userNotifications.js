import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, saveTokenId } from '../actions/actions';

import { Permissions, Notifications, Constants } from 'expo';
const { manifest } = Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
    : `api.example.com`;

const PUSH_ENDPOINT = `http://${api}/api/token/add`;

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

const getUserInfo = state => state.userInfo

export function* checkNotificationSettings() {
    console.log('in checkNotificationSettings')
    const userInfo = yield select(getUserInfo);
    if (!userInfo.tokenId) {
        yield call(registerForPushNotifications);
    } else {
        return;
    }
}

function* registerForPushNotifications() {
    console.log('in registerForPushNotifications')
    const { status: existingStatus } = yield call(Permissions.getAsync, Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = yield call(Permissions.askAsync, Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }
    // Get the token that uniquely identifies this device
    let token = yield call(Notifications.getExpoPushTokenAsync);

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    let response = yield call(fetch, PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token
        }),
    });
    let tokenId = yield response.json();
    yield put(saveTokenId(tokenId[0]))
    return;
}

function* notificationsSaga() {
    yield takeLatest('FETCH_NOTIFICATIONS', fetchNotifications);
    yield takeLatest('CHECK_NOTIFICATION_SETTINGS', checkNotificationSettings)
}

export default notificationsSaga;