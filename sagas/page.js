import { put, call, takeLatest, all, select } from 'redux-saga/effects'

import { types as pageTypes, actions as pageActions } from '../redux/pages'
import { getActiveDomain } from '../redux/domains'

import * as Sentry from 'sentry-expo'
import domainApiService from '../api/domain'

function* fetchPage(action) {
    const { pageId } = action
    try {
        yield put(pageActions.fetchPageRequest())

        const domain = yield select(getActiveDomain)

        const page = yield call(domainApiService.fetchPage, domain.url, pageId)
        yield put(pageActions.fetchPageSuccess(page))
    } catch (err) {
        console.log('error fetching page in saga', err)
        yield put(pageActions.fetchPageError('error fetching page'))
        Sentry.captureException(err)
    }
}

function* pageSaga() {
    yield all([takeLatest(pageTypes.FETCH_PAGE, fetchPage)])
}

export default pageSaga
