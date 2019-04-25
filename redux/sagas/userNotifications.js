import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, saveTokenId, setNotifications } from '../actions/actions';

import { Permissions, Notifications, Constants } from 'expo';
const { manifest } = Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
    : `api.example.com`;

const PUSH_ENDPOINT = `http://${api}/api/token/add`;
const ADD_NOTIFICATION_ENDPOINT = `http://${api}/api/subscribe`;
const REMOVE_NOTIFICATION_ENDPOINT = `http://${api}/api/unsubscribe`;

const FETCH_NOTIFICATIONS_ENDPOINT = `http://${api}/api/notifications`;


function* fetchNotifications(action) {
    const { tokenId } = action;
    console.log('in fetch notifications', tokenId)
    const response = yield call(fetch, `${FETCH_NOTIFICATIONS_ENDPOINT}/${tokenId}`);
    const notifications = yield response.json();
    yield put(setNotifications(notifications))
}

function* addNotification(action) {
    const { tokenId, categoryId } = action.payload;
    console.log('in add notification')
    yield call(fetch, ADD_NOTIFICATION_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tokenId,
            categoryId
        }),
    });
    yield call(fetchNotifications, {tokenId});
}

function* removeNotification(action) {
    const {tokenId, categoryId } = action.payload;
    yield call(fetch, REMOVE_NOTIFICATION_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tokenId,
            categoryId
        }),
    });
    yield call(fetchNotifications, {tokenId});
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
    yield put(saveTokenId(tokenId[0].id))
    return;
}

function* notificationsSaga() {
    yield takeLatest('ADD_NOTIFICATION', addNotification);
    yield takeLatest('REMOVE_NOTIFICATION', removeNotification);
    yield takeLatest('FETCH_NOTIFICATIONS', fetchNotifications);
    yield takeLatest('CHECK_NOTIFICATION_SETTINGS', checkNotificationSettings)
}

export default notificationsSaga;