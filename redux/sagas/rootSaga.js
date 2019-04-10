import { all } from 'redux-saga/effects';

import domainSaga from './domainSaga';
import articleSaga from './articleSaga';
import menuSaga from './menuSaga';

export default function* rootSaga() {
    yield all([
        domainSaga(),
        articleSaga(),
        menuSaga()
    ])
}