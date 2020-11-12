import { all, put, call, takeLatest, select } from 'redux-saga/effects'

import { types as savedArticleTypes, actions as savedArticleActions } from '../redux/savedArticles'
import { types as domainTypes, actions as domainActions } from '../redux/domains'
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
        takeLatest(savedArticleTypes.SAVE_ARTICLE, addToQueue, 'Article Added To Saved List'),
        takeLatest(
            savedArticleTypes.REMOVE_SAVED_ARTICLE,
            addToQueue,
            'Article Removed From Saved List'
        ),
        takeLatest(domainTypes.DELETE_DOMAIN, addToQueue, 'Organization Removed'),
    ])
}

export default snackbarQueue
