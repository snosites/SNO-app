import { all, put, call, takeLatest, select } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import { types as recentTypes, actions as recentActions } from '../redux/recent'

import domainApiService from '../api/domain'

import { asyncFetchFeaturedImage, asyncFetchComments } from '../utils/sagaHelpers'

import { getStoryExtras } from './article'

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)

function* fetchRecentArticles(action) {
    const { domain, categories, page } = action
    if (!page) {
        page = 1
    }
    try {
        yield put(recentActions.requestRecentArticles())

        const stories = yield call(domainApiService.fetchRecentArticles, {
            domainUrl: domain,
            categories,
            page,
        })

        yield all(
            stories.map((story) => {
                return call(getStoryExtras, domain, story)
            })
        )

        const normalizedData = normalize(stories, articleListSchema)
        yield put(recentActions.receiveRecentArticles(normalizedData))
    } catch (err) {
        console.log('error fetching recent articles in saga', err)
        yield put(recentActions.fetchRecentArticlesFailure('error in recent articles saga'))
    }
}

function shouldFetchRecentArticles(articles) {
    // if category doesnt exist fetch
    if (articles.items.length === 0) {
        return true
    }
    // if already fetching dont fetch
    else if (articles.isFetching) {
        return false
    }
    // if didInvalidate is true then fetch
    else {
        return articles.didInvalidate
    }
}

function shouldFetchMoreRecentArticles(articles) {
    // if page is not at max fetch more
    if (articles.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getMenuState = (state) => state.global.menuItems
const getRecentArticleState = (state) => state.recentArticles

function* fetchRecentArticlesIfNeeded(action) {
    const { domain } = action
    const recentArticles = yield select(getRecentArticleState)
    if (shouldFetchRecentArticles(recentArticles)) {
        const menus = yield select(getMenuState)
        if (menus) {
            const filteredMenus = menus.filter((item) => {
                return item.object === 'category'
            })
            const menuCategories = filteredMenus.map((item) => {
                return Number(item.object_id)
            })
            yield call(fetchRecentArticles, {
                domain,
                categories: menuCategories,
                page: 1,
            })
        }
    }
}

function* fetchMoreRecentArticlesIfNeeded(action) {
    const { domain } = action
    const recentArticles = yield select(getRecentArticleState)
    if (shouldFetchMoreRecentArticles(recentArticles)) {
        const menus = yield select(getMenuState)
        if (menus) {
            const filteredMenus = menus.filter((item) => {
                return item.object === 'category'
            })
            const menuCategories = filteredMenus.map((item) => {
                return Number(item.object_id)
            })
            yield call(fetchRecentArticles, {
                domain,
                categories: menuCategories,
                page: recentArticles.page,
            })
        }
    }
}

function* recentArticleSaga() {
    yield all([
        takeLatest(recentTypes.FETCH_RECENT_ARTICLES_IF_NEEDED, fetchRecentArticlesIfNeeded),
        takeLatest(
            recentTypes.FETCH_MORE_RECENT_ARTICLES_IF_NEEDED,
            fetchMoreRecentArticlesIfNeeded
        ),
    ])
}

export default recentArticleSaga
