import { all, put, call, takeLatest, select } from 'redux-saga/effects'

import { types as searchAuthorTypes, actions as searchAuthorActions } from '../redux/searchAuthors'
import domainApiService from '../api/domain'

function* fetchSearchAuthors(action) {
    const { domain, page, searchTerm } = action
    try {
        yield put(searchAuthorActions.requestSearchAuthors())

        const authors = yield call(domainApiService.searchAuthors, {
            domainUrl: domain,
            searchTerm,
            page,
        })

        yield put(searchAuthorActions.receiveSearchAuthors(authors))
    } catch (err) {
        console.log('error fetching search authors in saga', err)
        yield put(searchAuthorActions.fetchSearchAuthorsFailure('error in search saga'))
    }
}

function shouldFetchSearchAuthors(authors) {
    // if already fetching dont fetch
    if (authors.isFetching) {
        return false
    }
    // if didInvalidate is true then fetch
    else {
        return authors.didInvalidate
    }
}

function shouldFetchMoreSearchAuthors(authors) {
    // if page is not at max fetch more
    if (authors.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getSearchAuthorsState = (state) => state.searchAuthors

function* fetchSearchAuthorsIfNeeded(action) {
    const { domain, searchTerm } = action
    const searchAuthors = yield select(getSearchAuthorsState)
    if (shouldFetchSearchAuthors(searchAuthors)) {
        yield call(fetchSearchAuthors, {
            domain,
            searchTerm,
            page: 1,
        })
    }
}

function* fetchMoreSearchAuthorsIfNeeded(action) {
    const { domain, searchTerm } = action
    const searchAuthors = yield select(getSearchAuthorsState)
    if (shouldFetchMoreSearchAuthors(searchAuthors)) {
        yield call(fetchSearchAuthors, {
            domain,
            searchTerm,
            page: searchAuthors.page,
        })
    }
}

function* searchAuthorsaga() {
    yield all([
        takeLatest(searchAuthorTypes.FETCH_SEARCH_AUTHORS_IF_NEEDED, fetchSearchAuthorsIfNeeded),
        takeLatest(
            searchAuthorTypes.FETCH_MORE_SEARCH_AUTHORS_IF_NEEDED,
            fetchMoreSearchAuthorsIfNeeded
        ),
    ])
}

export default searchAuthorsaga
