import { all } from 'redux-saga/effects'

import userSaga from './user'
import globalSaga from './global'

export default function* rootSaga() {
    yield all([
        userSaga(),
        globalSaga()
    ])
}
