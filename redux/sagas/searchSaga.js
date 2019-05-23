import { all, put, call, takeLatest, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestSearchArticles, receiveSearchArticles, fetchSearchArticlesFailure } from '../actionCreators';

import { fetchFeaturedImage, fetchComments } from '../../utils/sagaHelpers';

import Sentry from 'sentry-expo';

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)

function* fetchSearchArticles(action) {
    const { domain, page, searchTerm } = action;
    try {
        const query = `https://${domain}/wp-json/wp/v2/posts?search=${searchTerm}&page=${page}`
        yield put(requestSearchArticles())
        const response = yield fetch(query)
        const stories = yield response.json();
        yield all(stories.map(story => {
            if (story._links['wp:featuredmedia']) {
                return call(fetchFeaturedImage, `${story._links['wp:featuredmedia'][0].href}`, story)
            } else {
                return call(Promise.resolve)
            }
        }))
        yield all(stories.map(story => {
            return call(fetchComments, domain, story)
        }))
        const normalizedData = normalize(stories, articleListSchema);
        yield put(receiveSearchArticles(normalizedData))
    }
    catch (err) {
        console.log('error fetching search articles in saga', err)
        yield put(fetchSearchArticlesFailure('error in search saga'))
        Sentry.captureException(err)
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

const getSearchArticleState = state => state.searchArticles

function* fetchSearchArticlesIfNeeded(action) {
    const { domain, searchTerm } = action;
    const searchArticles = yield select(getSearchArticleState);
    if (shouldFetchSearchArticles(searchArticles)) {
        yield call(fetchSearchArticles, {
            domain,
            searchTerm,
            page: 1
        })
    }
}



function* fetchMoreSearchArticlesIfNeeded(action) {
    const { domain, searchTerm } = action;
    const searchArticles = yield select(getSearchArticleState);
    if (shouldFetchMoreSearchArticles(searchArticles)) {
        yield call(fetchSearchArticles, {
            domain,
            searchTerm,
            page: searchArticles.page
        })
    }
}

function* searchArticleSaga() {
    yield takeLatest('FETCH_SEARCH_ARTICLES_IF_NEEDED', fetchSearchArticlesIfNeeded);
    yield takeLatest('FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED', fetchMoreSearchArticlesIfNeeded);

}

export default searchArticleSaga;