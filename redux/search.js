import union from 'lodash/union'

export const types = {
    // search articles
    INVALIDATE_SEARCH_ARTICLES: 'INVALIDATE_SEARCH_ARTICLES',
    FETCH_SEARCH_ARTICLES_IF_NEEDED: 'FETCH_SEARCH_ARTICLES_IF_NEEDED',
    FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED: 'FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED',
    REQUEST_SEARCH_ARTICLES: 'REQUEST_SEARCH_ARTICLES',
    RECEIVE_SEARCH_ARTICLES: 'RECEIVE_SEARCH_ARTICLES',
    FETCH_SEARCH_ARTICLES_FAILURE: 'FETCH_SEARCH_ARTICLES_FAILURE',
}

export default function searchArticles(
    state = {
        isFetching: false,
        didInvalidate: false,
        page: 1,
        items: [],
        error: '',
    },
    action
) {
    switch (action.type) {
        case types.INVALIDATE_SEARCH_ARTICLES:
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case types.REQUEST_SEARCH_ARTICLES:
            return Object.assign({}, state, {
                isFetching: true,
                error: '',
            })
        case types.FETCH_SEARCH_ARTICLES_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                error: action.error,
            })
        case types.RECEIVE_SEARCH_ARTICLES:
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

export const actions = {
    invalidateSearchArticles() {
        return {
            type: types.INVALIDATE_SEARCH_ARTICLES,
        }
    },
    fetchSearchArticlesIfNeeded(domain, searchTerm) {
        return {
            type: types.FETCH_SEARCH_ARTICLES_IF_NEEDED,
            domain,
            searchTerm,
        }
    },
    fetchMoreSearchArticlesIfNeeded(domain, searchTerm) {
        return {
            type: types.FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED,
            domain,
            searchTerm,
        }
    },
    requestSearchArticles() {
        return {
            type: types.REQUEST_SEARCH_ARTICLES,
        }
    },
    receiveSearchArticles(response) {
        return {
            type: types.RECEIVE_SEARCH_ARTICLES,
            response,
            receivedAt: Date.now(),
        }
    },
    fetchSearchArticlesFailure(error) {
        return {
            type: types.FETCH_SEARCH_ARTICLES_FAILURE,
            error,
            recievedAt: Date.now(),
        }
    },
}
