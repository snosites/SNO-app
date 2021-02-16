import union from 'lodash/union'

export const types = {
    INVALIDATE_SEARCH_AUTHORS: 'INVALIDATE_SEARCH_AUTHORS',
    FETCH_SEARCH_AUTHORS_IF_NEEDED: 'FETCH_SEARCH_AUTHORS_IF_NEEDED',
    FETCH_MORE_SEARCH_AUTHORS_IF_NEEDED: 'FETCH_MORE_SEARCH_AUTHORS_IF_NEEDED',
    REQUEST_SEARCH_AUTHORS: 'REQUEST_SEARCH_AUTHORS',
    RECEIVE_SEARCH_AUTHORS: 'RECEIVE_SEARCH_AUTHORS',
    FETCH_SEARCH_AUTHORS_FAILURE: 'FETCH_SEARCH_AUTHORS_FAILURE',
}

export default function searchAuthors(
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
        case types.INVALIDATE_SEARCH_AUTHORS:
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case types.REQUEST_SEARCH_AUTHORS:
            return Object.assign({}, state, {
                isFetching: true,
                error: '',
            })
        case types.FETCH_SEARCH_AUTHORS_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                error: action.error,
            })
        case types.RECEIVE_SEARCH_AUTHORS:
            let updatedPage = 'max'
            let newItems = []
            if (action.response.length == 10) {
                updatedPage = state.page + 1
            }
            if (state.didInvalidate) {
                newItems = action.response
            } else if (!state.didInvalidate) {
                newItems = union(state.items, action.response)
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
    invalidateSearchAuthors() {
        return {
            type: types.INVALIDATE_SEARCH_AUTHORS,
        }
    },
    fetchSearchAuthorsIfNeeded(domain, searchTerm) {
        return {
            type: types.FETCH_SEARCH_AUTHORS_IF_NEEDED,
            domain,
            searchTerm,
        }
    },
    fetchMoreSearchAuthorsIfNeeded(domain, searchTerm) {
        return {
            type: types.FETCH_MORE_SEARCH_AUTHORS_IF_NEEDED,
            domain,
            searchTerm,
        }
    },
    requestSearchAuthors() {
        return {
            type: types.REQUEST_SEARCH_AUTHORS,
        }
    },
    receiveSearchAuthors(response) {
        return {
            type: types.RECEIVE_SEARCH_AUTHORS,
            response,
            receivedAt: Date.now(),
        }
    },
    fetchSearchAuthorsFailure(error) {
        return {
            type: types.FETCH_SEARCH_AUTHORS_FAILURE,
            error,
            recievedAt: Date.now(),
        }
    },
}
