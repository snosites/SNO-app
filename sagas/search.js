import { all, put, call, takeLatest, select } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import { types as searchTypes, actions as searchActions } from '../redux/search'
import domainApiService from '../api/domain'

import { asyncFetchFeaturedImage, asyncFetchComments } from '../utils/sagaHelpers'

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)

function* fetchSearchArticles(action) {
    const { domain, page, searchTerm } = action
    try {
        yield put(searchActions.requestSearchArticles())

        const stories = yield call(domainApiService.searchArticles, {
            domainUrl: domain,
            searchTerm,
            page,
        })

        yield all(
            stories.map((story) => {
                if (story._links['wp:featuredmedia']) {
                    return call(
                        asyncFetchFeaturedImage,
                        `${story._links['wp:featuredmedia'][0].href}`,
                        story
                    )
                } else {
                    return call(Promise.resolve)
                }
            })
        )
        yield all(
            stories.map((story) => {
                return call(asyncFetchComments, domain, story)
            })
        )
        const normalizedData = normalize(stories, articleListSchema)
        yield put(searchActions.receiveSearchArticles(normalizedData))
    } catch (err) {
        console.log('error fetching search articles in saga', err)
        yield put(searchActions.fetchSearchArticlesFailure('error in search saga'))
    }
}

function shouldFetchSearchArticles(articles) {
    // if already fetching dont fetch
    if (articles.isFetching) {
        return false
    }
    // if didInvalidate is true then fetch
    else {
        return articles.didInvalidate
    }
}

function shouldFetchMoreSearchArticles(articles) {
    // if page is not at max fetch more
    if (articles.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getSearchArticleState = (state) => state.searchArticles

function* fetchSearchArticlesIfNeeded(action) {
    const { domain, searchTerm } = action
    const searchArticles = yield select(getSearchArticleState)
    if (shouldFetchSearchArticles(searchArticles)) {
        yield call(fetchSearchArticles, {
            domain,
            searchTerm,
            page: 1,
        })
    }
}

function* fetchMoreSearchArticlesIfNeeded(action) {
    const { domain, searchTerm } = action
    const searchArticles = yield select(getSearchArticleState)
    if (shouldFetchMoreSearchArticles(searchArticles)) {
        yield call(fetchSearchArticles, {
            domain,
            searchTerm,
            page: searchArticles.page,
        })
    }
}

function* searchArticleSaga() {
    yield all([
        takeLatest(searchTypes.FETCH_SEARCH_ARTICLES_IF_NEEDED, fetchSearchArticlesIfNeeded),
        takeLatest(
            searchTypes.FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED,
            fetchMoreSearchArticlesIfNeeded
        ),
    ])
}

export default searchArticleSaga
