import { all } from 'redux-saga/effects';

import domainSaga from './domainSaga';
import articleSaga from './articleSaga';
import recentArticleSaga from './recentArticleSaga';
import menuSaga from './menuSaga';
import profilesSaga from './ProfilesSaga';
import notificationsSaga from './userNotifications';

export default function* rootSaga() {
    yield all([
        domainSaga(),
        articleSaga(),
        recentArticleSaga(),
        menuSaga(),
        profilesSaga(),
        notificationsSaga()
    ])
}