import union from 'lodash/union'

export const types = {
    INVALIDATE_RECENT_ARTICLES: 'INVALIDATE_RECENT_ARTICLES',
    FETCH_RECENT_ARTICLES_IF_NEEDED: 'FETCH_RECENT_ARTICLES_IF_NEEDED',
    FETCH_MORE_RECENT_ARTICLES_IF_NEEDED: 'FETCH_MORE_RECENT_ARTICLES_IF_NEEDED',
    REQUEST_RECENT_ARTICLES: 'REQUEST_RECENT_ARTICLES',
    RECEIVE_RECENT_ARTICLES: 'RECEIVE_RECENT_ARTICLES',
    FETCH_RECENT_ARTICLES_FAILURE: 'FETCH_RECENT_ARTICLES_FAILURE'
}

export default function recentArticles(
    state = {
        isFetching: false,
        didInvalidate: false,
        page: 1,
        items: [],
        error: ''
    },
    action
) {
    switch (action.type) {
        case types.INVALIDATE_RECENT_ARTICLES:
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1
            })
        case types.REQUEST_RECENT_ARTICLES:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            })
        case types.FETCH_RECENT_ARTICLES_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                error: action.error
            })
        case types.RECEIVE_RECENT_ARTICLES:
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
                page: updatedPage
            })
        default:
            return state
    }
}


export const actions = {
           invalidateRecentArticles() {
               return {
                   type: types.INVALIDATE_RECENT_ARTICLES
               }
           },
           fetchRecentArticlesIfNeeded(domain) {
               return {
                   type: types.FETCH_RECENT_ARTICLES_IF_NEEDED,
                   domain
               }
           },
           fetchMoreRecentArticlesIfNeeded(domain) {
               return {
                   type: types.FETCH_MORE_RECENT_ARTICLES_IF_NEEDED,
                   domain
               }
           },
           requestRecentArticles() {
               return {
                   type: types.REQUEST_RECENT_ARTICLES
               }
           },
           receiveRecentArticles(response) {
               return {
                   type: types.RECEIVE_RECENT_ARTICLES,
                   response,
                   receivedAt: Date.now()
               }
           },
           fetchRecentArticlesFailure(error) {
               return {
                   type: types.FETCH_RECENT_ARTICLES_FAILURE,
                   error,
                   recievedAt: Date.now()
               }
           }
       }