import { all, put, call, takeLatest, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestArticles, receiveArticles, updateComments, fetchArticlesFailure, setCommentPosted } from '../actions/actions';

import Sentry from 'sentry-expo';

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)


function* fetchFeaturedImage(url, story) {
    const imgResponse = yield fetch(url);
    const featuredImage = yield imgResponse.json();
    if(!featuredImage.meta_fields){
        story.featuredImage = {
            uri: featuredImage.source_url,
            photographer: 'Unknown',
            caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
        }
        return;
    }
    story.featuredImage = {
        uri: featuredImage.source_url,
        photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
    }
}

function* fetchComments(url, story) {
    try {
        const response = yield fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`);
        const comments = yield response.json();
        story.comments = comments
        return;
    }
    catch (err) {
        console.log('error fetching comments');
        Sentry.captureException(err)
    }
}

// function* refetchComments(action) {
//     const { domain, articleId } = action;
//     console.log('in refetch comments', domain, articleId)
//     try {
//         const response = yield fetch(`https://${domain}/wp-json/wp/v2/comments?post=${articleId}`);
//         const comments = yield response.json();
//         yield put(updateComments({
//             articleId,
//             comments
//         }))
//     }
//     catch (err) {
//         console.log('error refetching comments in saga', err)
//         Sentry.captureException(err)
//     }
// }

function* addComment(action) {
    const { domain, articleId, username, email, comment } = action.payload;
    let objToSend = {
        author_email: email,
        author_name: username,
        content: comment,
        post: articleId
    }
    try {
        const response = yield call(fetch, `https://${domain}/wp-json/wp/v2/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objToSend),
        })
        console.log('repsonse comment', response)
        if(response.status !== 201){
            yield put(setCommentPosted('error'))
            throw new Error('error posting comment');
        } else {
            yield put(setCommentPosted('posted'))
        }
    }
    catch (err) {
        console.log('error adding comment in saga', err)
        Sentry.captureException(err)
    }
}


function* fetchArticles(action) {
    const { domain, category, page } = action;
    try {
        yield put(requestArticles(category))
        const response = yield fetch(`https://${domain}/wp-json/wp/v2/posts?categories=${category}&page=${page}`)
        const stories = yield response.json();
        yield all(stories.map(story => {
            if (story._links['wp:featuredmedia']) {
                return call(fetchFeaturedImage, `${story._links['wp:featuredmedia'][0].href}`, story)
            } else {
                return call(Promise.resolve);
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
        yield put(fetchArticlesFailure(category, 'error in article saga'))
        Sentry.captureException(err)
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
    // yield takeLatest('REFETCH_COMMENTS', refetchComments);
    yield takeLatest('ADD_COMMENT', addComment)

}

export default articleSaga;