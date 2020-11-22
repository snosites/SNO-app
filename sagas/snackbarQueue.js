import { all, put, call, takeLatest, select } from 'redux-saga/effects'

import { types as savedArticleTypes, actions as savedArticleActions } from '../redux/savedArticles'
import { types as domainTypes, actions as domainActions } from '../redux/domains'
import { types as articleTypes, actions as articleActions } from '../redux/articles'
import { types as userTypes } from '../redux/user'
import {
    types as snackbarQueueTypes,
    actions as snackbarQueueActions,
} from '../redux/snackbarQueue'

function* addToQueue(message) {
    try {
        yield put(snackbarQueueActions.addMessage(message))
    } catch (err) {
        console.log('error adding message to snackbar queue', err)
    }
}

function* snackbarQueue() {
    yield all([
        takeLatest(savedArticleTypes.SAVE_ARTICLE, addToQueue, 'Article added to saved list'),
        takeLatest(
            savedArticleTypes.REMOVE_SAVED_ARTICLE,
            addToQueue,
            'Article removed from saved list'
        ),
        takeLatest(domainTypes.DELETE_DOMAIN, addToQueue, 'Organization removed'),
        takeLatest(userTypes.SUBSCRIBE_SUCCESS, addToQueue, 'Followed writer'),
        takeLatest(userTypes.UNSUBSCRIBE_SUCCESS, addToQueue, 'Unfollowed writer'),
        takeLatest(userTypes.SUBSCRIBE_ERROR, addToQueue, 'Error following writer'),
        takeLatest(userTypes.UNSUBSCRIBE_ERROR, addToQueue, 'Error unfollowing writer'),
        takeLatest(
            articleTypes.ADD_COMMENT_SUCCESS,
            addToQueue,
            'Success!  Your comment is awaiting review.'
        ),
        takeLatest(
            articleTypes.ADD_COMMENT_ERROR,
            addToQueue,
            'There was an error submitting your comment.  Please try again.'
        ),
        takeLatest(
            articleTypes.ASYNC_FETCH_ARTICLE_ERROR,
            addToQueue,
            'There was an error fetching that article.  Please try again later.'
        ),
        takeLatest(
            articleTypes.ASYNC_FETCH_ARTICLE_ERROR,
            addToQueue,
            'There was an error fetching that article.  Please try again later.'
        ),
        takeLatest(
            userTypes.DELETE_USER_ERROR,
            addToQueue,
            'There was an error clearing your settings. Please try again later.'
        ),
    ])
}

export default snackbarQueue
