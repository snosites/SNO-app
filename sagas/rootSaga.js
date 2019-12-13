import { all } from 'redux-saga/effects'

import userSaga from './user'
import globalSaga from './global'
import startupSaga from './startup'
import articleSaga from './article'
import searchSaga from './search'
import profileSaga from './profile'
import recentSaga from './recent'

export default function* rootSaga() {
    yield all([
        userSaga(),
        globalSaga(),
        startupSaga(),
        articleSaga(),
        searchSaga(),
        profileSaga(),
        recentSaga()
    ])
}
