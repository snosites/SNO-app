import { all } from 'redux-saga/effects';

import domainSaga from './domainSaga';

export default function* rootSaga() {
    yield all([
        domainSaga()
    ])
}