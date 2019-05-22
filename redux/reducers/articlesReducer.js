import {
    INVALIDATE_ARTICLES,
    REQUEST_ARTICLES,
    FETCH_ARTICLES_FAILURE,
    RECEIVE_ARTICLES,
} from '../actionCreators/articles'

import merge from 'lodash/merge';
import union from 'lodash/union';

// ARTICLES REDUCERS //

// runs every time an action is sent
export function entities(state = { articles: {} }, action) {
    if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities)
    }
    // else if (action.type === 'UPDATE_COMMENTS') {
    //     return merge({}, state,
    //         {
    //             articles: {
    //                 [action.payload.articleId]: {
    //                     comments: action.payload.comments
    //                 }
    //             }
    //         })
    // }
    return state
}

function articles(
    state = {
        isFetching: false,
        didInvalidate: false,
        refreshing: false,
        page: 1,
        items: [],
        error: ''
    },
    action
) {
    switch (action.type) {
        case INVALIDATE_ARTICLES:
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case REQUEST_ARTICLES:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            })
        case FETCH_ARTICLES_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                error: action.error
            })
        case RECEIVE_ARTICLES:
            let updatedPage = 'max';
            let newItems = [];
            if (action.response.result.length == 10) {
                updatedPage = state.page + 1
            };
            if (state.didInvalidate) {
                newItems = action.response.result;
            }
            else if (!state.didInvalidate) {
                newItems = union(state.items, action.response.result);
            }
            return Object.assign({}, state, {
                categoryId: action.category,
                isFetching: false,
                didInvalidate: false,
                items: newItems,
                lastUpdated: action.receivedAt,
                page: updatedPage
            })
        default:
            return state
    }
}

export function articlesByCategory(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_ARTICLES:
        case REQUEST_ARTICLES:
        case RECEIVE_ARTICLES:
        case FETCH_ARTICLES_FAILURE:
            return {
                ...state,
                [action.category]: articles(state[action.category], action)
            }
        default:
            return state
    }
}