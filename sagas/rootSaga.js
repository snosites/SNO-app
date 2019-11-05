import { all } from 'redux-saga/effects'

import userSaga from './user'
import globalSaga from './global'
import startupSaga from './startup'

export default function* rootSaga() {
    yield all([
        userSaga(),
        globalSaga(),
        startupSaga()
    ])
}
