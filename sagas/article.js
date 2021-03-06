import { all, put, call, takeLatest, takeEvery, select } from 'redux-saga/effects'
import { normalize, schema } from 'normalizr'

import { types as articleTypes, actions as articleActions } from '../redux/articles'
import { actions as userActions } from '../redux/user'
import domainApiService from '../api/domain'

import {
    asyncFetchArticle,
    asyncFetchFeaturedImage,
    asyncFetchComments,
    getAttachmentsAsync,
} from '../utils/sagaHelpers'

import * as Sentry from 'sentry-expo'

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)

function* addComment(action) {
    const { domain, articleId, username, email, comment } = action.payload

    let objToSend = {
        author_email: email,
        author_name: username,
        content: comment,
        post: articleId,
    }

    try {
        yield put(articleActions.addCommentRequest())
        yield call(domainApiService.addComment, domain, objToSend)
        yield put(articleActions.addCommentSuccess())
    } catch (err) {
        console.log('error adding comment in saga', err)
        yield put(articleActions.addCommentError('error in saga'))
    }
}

function* fetchArticles(action) {
    const { domain, category, page } = action
    try {
        yield put(articleActions.requestArticles(category))

        const childCategories = yield call(domainApiService.fetchChildCategories, {
            domainUrl: domain,
            parentCategoryId: category,
        })

        const childCategoryIds = childCategories.map((obj) => obj.id).toString()

        const stories = yield call(domainApiService.fetchArticles, {
            domainUrl: domain,
            category,
            childCategoryIds,
            page,
        })

        yield all(
            stories.map((story) => {
                return call(getStoryExtras, domain, story)
            })
        )
        // yield all(
        //     stories.map((story) => {
        //         return call(asyncFetchComments, domain, story)
        //     })
        // )
        const normalizedData = normalize(stories, articleListSchema)

        yield put(articleActions.receiveArticles(category, normalizedData))
    } catch (err) {
        console.log('error fetching articles in saga', err, category)
        yield put(articleActions.fetchArticlesFailure(category, 'error in article saga'))
        Sentry.captureException(err)
    }
}

export function* getStoryExtras(domainUrl, article) {
    try {
        if (
            article._links &&
            article._links['wp:featuredmedia'] &&
            article._links['wp:featuredmedia'][0]
        ) {
            yield call(
                asyncFetchFeaturedImage,
                `${article._links['wp:featuredmedia'][0].href}`,
                article
            )
        }
        if (
            article.custom_fields.featureimage &&
            article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images'
        ) {
            article.slideshow = yield call(getAttachmentsAsync, article)
        }

        let storyChapters = []
        let metaKey = ''

        if (article.custom_fields.sno_format == 'Long-Form') {
            metaKey = 'sno_longform_list'
        } else if (article.custom_fields.sno_format == 'Grid') {
            metaKey = 'sno_grid_list'
        } else if (article.custom_fields.sno_format == 'Side by Side') {
            metaKey = 'sno_sidebyside_list'
        }
        if (metaKey) {
            storyChapters = yield call(
                domainApiService.fetchArticleChapterInfo,
                domainUrl,
                article.id,
                metaKey
            )
        }

        // let updatedStoryChapters = await Promise.all(
        //     storyChapters.map(async (article) => {
        //         return await asyncFetchArticle(domainUrl, article.ID, true)
        //     })
        // )
        // let updatedStoryChapters = await Promise.all(
        //     storyChapters.map(async (article) => {
        //         return await asyncFetchArticle(domainUrl, article.ID, true)
        //     })
        // )
        let updatedStoryChapters = yield all(
            storyChapters.map((story) => {
                return call(asyncFetchArticle, domainUrl, story.ID, true)
            })
        )

        article.storyChapters = updatedStoryChapters
        return article
    } catch (err) {
        console.log('error fetching article extras', err)
        return article
    }
}

function shouldFetchArticles(articles) {
    // if category doesnt exist fetch
    if (!articles) {
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

function shouldFetchMoreArticles(articles) {
    // if page is not at max fetch more
    if (articles.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getArticlesByCategory = (state) => state.articlesByCategory

function* fetchArticlesIfNeeded(action) {
    const { domain, category, force = false } = action.payload
    const articlesByCategory = yield select(getArticlesByCategory)
    const articles = articlesByCategory[category]
    if (force || shouldFetchArticles(articles)) {
        yield call(fetchArticles, {
            domain,
            category,
            page: 1,
        })
    }
    return
}

function* fetchMoreArticlesIfNeeded(action) {
    const { domain, category } = action.payload
    const articlesByCategory = yield select(getArticlesByCategory)
    const articles = articlesByCategory[category]
    if (shouldFetchMoreArticles(articles)) {
        yield call(fetchArticles, {
            domain,
            category,
            page: articles.page,
        })
    }
}

function* articleSaga() {
    yield all([
        takeEvery(articleTypes.FETCH_ARTICLES_IF_NEEDED, fetchArticlesIfNeeded),
        takeLatest(articleTypes.FETCH_MORE_ARTICLES_IF_NEEDED, fetchMoreArticlesIfNeeded),
        takeLatest(articleTypes.ADD_COMMENT, addComment),
    ])
}

export default articleSaga
