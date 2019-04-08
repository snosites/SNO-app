import { all } from 'redux-saga/effects';

import domainSaga from './domainSaga';
import articleSaga from './articleSaga';

export default function* rootSaga() {
    yield all([
        domainSaga(),
        articleSaga()
    ])
}