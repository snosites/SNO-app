import { all } from 'redux-saga/effects';

import domainSaga from './domainSaga';
import articleSaga from './articleSaga';
import recentArticleSaga from './recentArticleSaga';
import searchArticleSaga from './searchSaga';
import menuSaga from './menuSaga';
import profilesSaga from './ProfilesSaga';
import notificationsSaga from './userNotifications';
import initializationSaga from './initializationSaga';

export default function* rootSaga() {
    yield all([
        domainSaga(),
        articleSaga(),
        recentArticleSaga(),
        searchArticleSaga(),
        menuSaga(),
        profilesSaga(),
        notificationsSaga(),
        initializationSaga()
    ])
}