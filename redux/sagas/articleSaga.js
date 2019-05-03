import { all, put, call, takeLatest, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestArticles, receiveArticles, updateComments } from '../actions/actions';

import Moment from 'moment';

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)


function* fetchFeaturedImage(url, story) {
    const imgResponse = yield fetch(url);
    const featuredImage = yield imgResponse.json();
    console.log('featuredImage', featuredImage)
    story.featuredImage = {
        uri: featuredImage.source_url,
        photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
    }
}

function* fetchComments(url, story) {
    const response = yield fetch(`${url}/wp-json/wp/v2/comments?post=${story.id}`);
    const comments = yield response.json();
    story.comments = comments
    return;
}

function* refetchComments(action) {
    const { domain, articleId } = action;
    try {
        const response = yield fetch(`${domain}/wp-json/wp/v2/comments?post=${articleId}`);
        const comments = yield response.json();
        yield put(updateComments({
            articleId,
            comments
        }))
    }
    catch (err) {
        console.log('error refetching comments in saga', err)
    }
}

function* addComment(action) {
    console.log('date', String(Moment.now()));
    const { domain, articleId, username, email, comment } = action.payload;
    let objToSend = {
        author_email: email,
        author_name: username,
        content: comment,
        // date: String(Moment.now()),
        post: articleId
    }
    try {
        const temp = yield call(fetch, `${domain}/wp-json/wp/v2/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objToSend),
        })
        yield call(refetchComments, {
            domain,
            articleId
        })
    }
    catch (err) {
        console.log('error adding comment in saga', err)
    }
}


function* fetchArticles(action) {
    const { domain, category, page } = action;
    try {
        yield put(requestArticles(category))
        const response = yield fetch(`${domain}/wp-json/wp/v2/posts?categories=${category}&page=${page}`)
        const stories = yield response.json();
        yield all(stories.map(story => {
            if(story._links['wp:featuredmedia']) {
                console.log(story._links['wp:featuredmedia'][0].href)
                return call(fetchFeaturedImage, `${story._links['wp:featuredmedia'][0].href}`, story)
            } else {
                return;
            }
        }))
        yield all(stories.map(story => {
            return call(fetchComments, domain, story)
        }))
        const normalizedData = normalize(stories, articleListSchema);
        yield put(receiveArticles(category, normalizedData))
    }
    catch (err) {
        console.log('error fetching articles in saga', err)
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

const getArticlesByCategory = state => state.articlesByCategory

function* fetchArticlesIfNeeded(action) {
    const { domain, category } = action.payload;
    const articlesByCategory = yield select(getArticlesByCategory);
    const articles = articlesByCategory[category];
    if (shouldFetchArticles(articles)) {
        yield call(fetchArticles, {
            domain,
            category,
            page: 1
        })
    }
}

function* fetchMoreArticlesIfNeeded(action) {
    const { domain, category } = action.payload;
    const articlesByCategory = yield select(getArticlesByCategory);
    const articles = articlesByCategory[category];
    if (shouldFetchMoreArticles(articles)) {
        yield call(fetchArticles, {
            domain,
            category,
            page: articles.page
        })
    }
}

function* articleSaga() {
    yield takeLatest('FETCH_ARTICLES_IF_NEEDED', fetchArticlesIfNeeded);
    yield takeLatest('FETCH_MORE_ARTICLES_IF_NEEDED', fetchMoreArticlesIfNeeded);
    yield takeLatest('REFETCH_COMMENTS', refetchComments);
    yield takeLatest('ADD_COMMENT', addComment)

}

export default articleSaga;