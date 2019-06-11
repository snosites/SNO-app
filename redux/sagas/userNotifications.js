import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, saveTokenId, setNotifications, setApiKey, setError, clearingSettings, resetSettings } from '../actionCreators';

import NavigationService from '../../utils/NavigationService';

import { persistor } from '../configureStore';
import { Permissions, Notifications } from 'expo';

import Sentry from 'sentry-expo';

const api = 'mobileapi.snosites.net';

const GET_API_TOKEN_ENDPOINT = `http://${api}/api/key`;
const GET_USERS_ENDPOINT = `http://${api}/api/users`;
const PUSH_ENDPOINT = `http://${api}/api/users/add_token`;
const DELETE_USER_ENDPOINT = `http://${api}/api/users/delete`;
const ADD_NOTIFICATION_ENDPOINT = `http://${api}/api/subscribe`;
const ADD_ALL_NOTIFICATIONS_ENDPOINT = `http://${api}/api/subscribe/all`;
const REMOVE_NOTIFICATION_ENDPOINT = `http://${api}/api/unsubscribe`;
const FETCH_NOTIFICATIONS_ENDPOINT = `http://${api}/api/notifications`;

const getUserInfo = state => state.userInfo;

function* fetchNotifications(action) {
    // const activeDomain = yield select(getActiveDomain);
    const { tokenId, domain } = action.payload;
    const userInfo = yield select(getUserInfo)
    if (!tokenId) {
        return;
    }
    const response = yield call(fetch, `${FETCH_NOTIFICATIONS_ENDPOINT}/${String(tokenId)}?api_token=${userInfo.apiKey}`);
    const notifications = yield response.json();
    yield put(setNotifications(notifications, domain))
}

export function* addNotification(action) {
    const { tokenId, categoryId, domain } = action.payload;
    const userInfo = yield select(getUserInfo)
    yield call(fetch, `${ADD_NOTIFICATION_ENDPOINT}?api_token=${userInfo.apiKey}`, {
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
    yield call(fetchNotifications, {
        payload: {
            tokenId,
            domain
        }
    });
}

export function* addAllNotifications(action) {
    const { tokenId, categoryIds } = action.payload;
    const userInfo = yield select(getUserInfo)
    console.log('in add all', tokenId, categoryIds)
    yield call(fetch, `${ADD_ALL_NOTIFICATIONS_ENDPOINT}?api_token=${userInfo.apiKey}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tokenId,
            categoryIds
        }),
    });
}

function* removeNotification(action) {
    const { tokenId, categoryId, domain } = action.payload;
    const userInfo = yield select(getUserInfo)
    yield call(fetch, `${REMOVE_NOTIFICATION_ENDPOINT}?api_token=${userInfo.apiKey}`, {
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
    yield call(fetchNotifications, {
        payload: {
            tokenId,
            domain
        }
    });
}

export function* checkNotificationSettings() {
    const userInfo = yield select(getUserInfo)
    const { status: existingStatus } = yield call(Permissions.getAsync, Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = yield call(Permissions.askAsync, Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
    // Stop here if the user did not grant permissions -- save token as 0
    if (finalStatus !== 'granted') {
        console.log('notification status is not granted')
        yield put(saveTokenId(0));
        return;
    }
    // Get the token that uniquely identifies this device
    let token = yield call(Notifications.getExpoPushTokenAsync);
    let response = yield call(fetch, `${GET_USERS_ENDPOINT}/${userInfo.apiKey}?api_token=${userInfo.apiKey}`);
    let tokenResponse = yield response.json();
    let tokenId;
    // if there is already a token saved in DB update it in redux
    if (tokenResponse[0].token) {
        console.log('token response', tokenResponse[0])
        tokenId = tokenResponse[0].id;
        yield put(saveTokenId(tokenResponse[0].id));
        // if not save it in DB and then save in redux
    } else {
        tokenId = yield call(savePushNotifications, token);
    }
    return tokenId;

}

function* savePushNotifications(token) {
    // POST the token to backend server
    const userInfo = yield select(getUserInfo)
    let response = yield call(fetch, `${PUSH_ENDPOINT}?api_token=${userInfo.apiKey}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token,
            api_token: userInfo.apiKey
        }),
    });
    let tokenId = yield response.json();
    yield put(saveTokenId(Number(tokenId[0].id)))
    return tokenId[0].id;
}

function* getApiKey() {
    try {
        
        let response = yield call(fetch, GET_API_TOKEN_ENDPOINT);
        console.log('repsonse', response)
        let apiKey = yield response.json();
        yield put(setApiKey(apiKey))
    } catch(err) {
        console.log('error getting api key in saga', err)
        yield put(setError('api-saga error'))
        Sentry.captureException(err)
    }
}

function* deleteUser(action){
    try {
        let response = yield call(fetch, `${DELETE_USER_ENDPOINT}?api_token=${action.apiKey}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token_id: action.tokenId
            })
        });
        const deleted = yield response.json();
        if (response.status != 200){
            yield put(clearingSettings(false))
            throw new Error(response.status)
        } else {
            yield put(resetSettings());
        }
    } catch(err) {
        console.log('error deleting user in saga', err)
        yield put(setError('delete user-saga error'))
        Sentry.captureException(err)
    }
}

function* notificationsSaga() {
    yield takeLatest('ADD_NOTIFICATION', addNotification);
    yield takeLatest('ADD_ALL_NOTIFICATIONS', addAllNotifications);
    yield takeLatest('REMOVE_NOTIFICATION', removeNotification);
    yield takeLatest('FETCH_NOTIFICATIONS', fetchNotifications);
    yield takeLatest('CHECK_NOTIFICATION_SETTINGS', checkNotificationSettings)
    yield takeLatest('GET_API_KEY', getApiKey);
    yield takeLatest('DELETE_USER', deleteUser)


}

export default notificationsSaga;