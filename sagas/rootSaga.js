import { all } from 'redux-saga/effects'

import userSaga from './user'
import globalSaga from './global'
import startupSaga from './startup'
import articleSaga from './article'
import searchSaga from './search'
import searchAuthorsSaga from './searchAuthors'
import profileSaga from './profile'
import pageSaga from './page'
import recentSaga from './recent'
import snackbarQueueSaga from './snackbarQueue'

export default function* rootSaga() {
    yield all([
        userSaga(),
        globalSaga(),
        startupSaga(),
        articleSaga(),
        searchSaga(),
        profileSaga(),
        searchAuthorsSaga(),
        pageSaga(),
        recentSaga(),
        snackbarQueueSaga(),
    ])
}
