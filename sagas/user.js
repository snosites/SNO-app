import { put, call, takeLatest, all, select } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'
import Constants from 'expo-constants'

import { types as userTypes, actions as userActions, getApiToken } from '../redux/user'
import { actions as domainsActions } from '../redux/domains'

import apiService from '../api/api'

import { persistor } from '../redux/configureStore'
import NavigationService from '../utils/NavigationService'

// import { persistor } from '../configureStore'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import * as Sentry from 'sentry-expo'

// const api = 'mobileapi.snosites.net'

// const GET_API_TOKEN_ENDPOINT = `http://${api}/api/key`
// const GET_USERS_ENDPOINT = `http://${api}/api/users`
// const PUSH_ENDPOINT = `http://${api}/api/users/add_token`
// const ADD_NOTIFICATION_ENDPOINT = `http://${api}/api/subscribe`
// const ADD_ALL_NOTIFICATIONS_ENDPOINT = `http://${api}/api/subscribe/all`
// const REMOVE_NOTIFICATION_ENDPOINT = `http://${api}/api/unsubscribe`
// const FETCH_NOTIFICATIONS_ENDPOINT = `http://${api}/api/notifications`

function* findOrCreateUser() {
    try {
        yield put(userActions.findOrCreateUserRequest())
        let response = yield call(apiService.findOrCreateUser, Constants.installationId)
        yield put(userActions.findOrCreateUserSuccess(response))
    } catch (err) {
        console.log('error creating user in saga', err, err.response)
        yield put(userActions.findOrCreateUserError('error creating user'))
        Sentry.captureException(err)
    }
}

export function* fetchNotificationSubscriptions(domainId) {
    const apiToken = yield select(getApiToken)

    const [notifications, writerNotifications] = yield all([
        call(apiService.getSubscriptions, apiToken),
        call(apiService.getWriterSubscriptions, apiToken)
    ])

    console.log('notifications', notifications, writerNotifications)
    yield put(domainsActions.setNotifications(domainId, notifications))
    yield put(userActions.setWriterSubscriptions(writerNotifications))
}

function* subscribe(action) {
    try {
        const { subscriptionType, ids, domainId } = action.payload
        yield put(userActions.subscribeRequest())

        const apiToken = yield select(getApiToken)

        yield call(apiService.subscribe, apiToken, subscriptionType, ids, domainId)

        if (domainId) yield call(fetchNotificationSubscriptions, domainId)

        yield put(userActions.subscribeSuccess())
    } catch (err) {
        console.log('error in subscribe user saga', err, err.response)
        yield put(userActions.subscribeError('error subscribing user'))
    }
}

function* unsubscribe(action) {
    try {
        const { subscriptionType, ids, domainId } = action.payload
        yield put(userActions.unsubscribeRequest())

        const apiToken = yield select(getApiToken)

        yield call(apiService.unsubscribe, apiToken, subscriptionType, ids)

        if (domainId) yield call(fetchNotificationSubscriptions, domainId)

        yield put(userActions.unsubscribeSuccess())
    } catch (err) {
        console.log('error in unsubscribe user saga', err, err.response)
        yield put(userActions.unsubscribeError('error unsubscribing user'))
    }
}

export function* checkNotificationSettings() {
    try {
        const apiToken = yield select(getApiToken)

        const { status: existingStatus } = yield call(
            Permissions.getAsync,
            Permissions.NOTIFICATIONS
        )
        let finalStatus = existingStatus

        if (existingStatus !== 'granted') {
            const { status } = yield call(Permissions.askAsync, Permissions.NOTIFICATIONS)
            finalStatus = status
        }
        // Stop here if the user did not grant permissions -- save token as 0
        if (finalStatus !== 'granted') {
            //update user's push_token
            const updatedUser = yield call(apiService.updateUser, apiToken, {
                key: 'push_token',
                value: null
            })
            yield put(userActions.setUser(updatedUser))
            return null
        }

        // Get the token that uniquely identifies this device
        let token = yield call(Notifications.getExpoPushTokenAsync)

        //update user's push_token
        let updatedUser = yield call(apiService.updateUser, apiToken, {
            key: 'push_token',
            value: token
        })
        yield put(userActions.setUser(updatedUser))

        return updatedUser.push_token
    } catch (err) {
        console.log('error in check notification settings saga', err)
        throw err
    }
}

// function* savePushNotifications(token) {
//     // POST the token to backend server
//     const userInfo = yield select(getUserInfo)
//     let response = yield call(fetch, `${PUSH_ENDPOINT}?api_token=${userInfo.apiKey}`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             token,
//             api_token: userInfo.apiKey
//         })
//     })
//     let tokenId = yield response.json()
//     yield put(saveTokenId(Number(tokenId[0].id)))
//     return tokenId[0].id
// }

function* deleteUser() {
    try {
        yield put(userActions.deleteUserRequest())
        const apiToken = yield select(getApiToken)

        yield call(apiService.deleteUser, apiToken)

        persistor.purge()
        yield put({
            type: 'PURGE_USER_STATE'
        })

        NavigationService.navigate('AuthLoading')

        yield put(userActions.deleteUserSuccess())
    } catch (err) {
        console.log('error deleting user in saga', err)
        yield put(userActions.deleteUserError('delete user-saga error'))
        Sentry.captureException(err)
    }
}

function* userSaga() {
    yield all([
        takeLatest(userTypes.FIND_OR_CREATE_USER, findOrCreateUser),
        takeLatest(userTypes.SUBSCRIBE, subscribe),
        takeLatest(userTypes.UNSUBSCRIBE, unsubscribe),
        // yield takeLatest('FETCH_NOTIFICATIONS', fetchNotifications)
        // yield takeLatest('CHECK_NOTIFICATION_SETTINGS', checkNotificationSettings)
        takeLatest(userTypes.DELETE_USER, deleteUser)
    ])
}

export default userSaga
