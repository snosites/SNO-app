import {
    INVALIDATE_SEARCH_ARTICLES,
    REQUEST_SEARCH_ARTICLES,
    FETCH_SEARCH_ARTICLES_FAILURE,
    RECEIVE_SEARCH_ARTICLES
} from '../actionCreators/articles'

import union from 'lodash/union';

export function searchArticles(state = {
    isFetching: false,
    didInvalidate: false,
    page: 1,
    items: [],
    error: ''
}, action) {
    switch (action.type) {
        case INVALIDATE_SEARCH_ARTICLES:
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case REQUEST_SEARCH_ARTICLES:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            })
        case FETCH_SEARCH_ARTICLES_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                error: action.error
            })
        case RECEIVE_SEARCH_ARTICLES:
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
                isFetching: false,
                didInvalidate: false,
                items: newItems,
                lastUpdated: action.receivedAt,
                page: updatedPage,
            })
        default:
            return state
    }
}