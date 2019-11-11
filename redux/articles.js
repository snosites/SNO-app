import merge from 'lodash/merge'
import union from 'lodash/union'

export const types = {
    // articles
    SELECT_CATEGORY: 'SELECT_CATEGORY',
    INVALIDATE_ARTICLES: 'INVALIDATE_ARTICLES',
    FETCH_ARTICLES_IF_NEEDED: 'FETCH_ARTICLES_IF_NEEDED',
    FETCH_MORE_ARTICLES_IF_NEEDED: 'FETCH_MORE_ARTICLES_IF_NEEDED',
    REQUEST_ARTICLES: 'REQUEST_ARTICLES',
    RECEIVE_ARTICLES: 'RECEIVE_ARTICLES',
    FETCH_ARTICLES_FAILURE: 'FETCH_ARTICLES_FAILURE',
    //comments
    UPDATE_COMMENTS: 'UPDATE_COMMENTS',
    REFETCH_COMMENTS: 'REFETCH_COMMENTS',
    ADD_COMMENT: 'ADD_COMMENT'
}

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
        case types.INVALIDATE_ARTICLES:
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1
            })
        case types.REQUEST_ARTICLES:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            })
        case types.FETCH_ARTICLES_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                error: action.error
            })
        case types.RECEIVE_ARTICLES:
            let updatedPage = 'max'
            let newItems = []
            if (action.response.result.length == 10) {
                updatedPage = state.page + 1
            }
            if (state.didInvalidate) {
                newItems = action.response.result
            } else if (!state.didInvalidate) {
                newItems = union(state.items, action.response.result)
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

export default function articlesByCategory(state = {}, action) {
    switch (action.type) {
        case types.INVALIDATE_ARTICLES:
        case types.REQUEST_ARTICLES:
        case types.RECEIVE_ARTICLES:
        case types.FETCH_ARTICLES_FAILURE:
            return {
                ...state,
                [action.category]: articles(state[action.category], action)
            }
        default:
            return state
    }
}

export const actions = {
    selectCategory(category) {
        return {
            type: types.SELECT_CATEGORY,
            category
        }
    },
    invalidateArticles(category) {
        return {
            type: types.INVALIDATE_ARTICLES,
            category
        }
    },
    fetchArticlesIfNeeded(payload) {
        return {
            type: types.FETCH_ARTICLES_IF_NEEDED,
            payload
        }
    },
    fetchMoreArticlesIfNeeded(payload) {
        return {
            type: types.FETCH_MORE_ARTICLES_IF_NEEDED,
            payload
        }
    },
    requestArticles(category) {
        return {
            type: types.REQUEST_ARTICLES,
            category
        }
    },
    receiveArticles(category, response) {
        return {
            type: types.RECEIVE_ARTICLES,
            category,
            response,
            receivedAt: Date.now()
        }
    },
    fetchArticlesFailure(category, error) {
        return {
            type: types.FETCH_ARTICLES_FAILURE,
            category,
            error,
            recievedAt: Date.now()
        }
    },
    //comments
    updateComments(payload) {
        return {
            type: types.UPDATE_COMMENTS,
            payload
        }
    },
    refetchComments(domain, articleId) {
        return {
            type: types.REFETCH_COMMENTS,
            domain,
            articleId
        }
    },
    addComment(payload) {
        return {
            type: types.ADD_COMMENT,
            payload
        }
    }
}
