import { all } from 'redux-saga/effects'

import userSaga from './user'
import globalSaga from './global'
import startupSaga from './startup'
import articleSaga from './article'

export default function* rootSaga() {
    yield all([
        userSaga(),
        globalSaga(),
        startupSaga(),
        articleSaga()
    ])
}
