import union from 'lodash/union'

export const types = {
    FETCH_ARTICLE_SEARCH_RESULTS: 'FETCH_ARTICLE_SEARCH_RESULTS',
    FETCH_ARTICLE_SEARCH_RESULTS_REQUEST: 'FETCH_ARTICLE_SEARCH_RESULTS_REQUEST',
    FETCH_ARTICLE_SEARCH_RESULTS_SUCCESS: 'FETCH_ARTICLE_SEARCH_RESULTS_SUCCESS',
    FETCH_ARTICLE_SEARCH_RESULTS_ERROR: 'FETCH_ARTICLE_SEARCH_RESULTS_ERROR',
    FETCH_AUTHOR_SEARCH_RESULTS: 'FETCH_AUTHOR_SEARCH_RESULTS',
    FETCH_AUTHOR_SEARCH_RESULTS_REQUEST: 'FETCH_AUTHOR_SEARCH_RESULTS_REQUEST',
    FETCH_AUTHOR_SEARCH_RESULTS_SUCCESS: 'FETCH_AUTHOR_SEARCH_RESULTS_SUCCESS',
    FETCH_AUTHOR_SEARCH_RESULTS_ERROR: 'FETCH_AUTHOR_SEARCH_RESULTS_ERROR',
}

export default function search(
    state = {
        articles: [],
        profiles: [],
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

        default:
            return state
    }
}

export const actions = {
    // article
    fetchArticleSearchResults: (searchTerm) => ({
        type: types.FETCH_ARTICLE_SEARCH_RESULTS,
        searchTerm,
    }),
    fetchArticleSearchResultsRequest: () => ({
        type: types.FETCH_ARTICLE_SEARCH_RESULTS_REQUEST,
    }),
    fetchArticleSearchResultsSuccess: (payload) => ({
        type: types.FETCH_ARTICLE_SEARCH_RESULTS_SUCCESS,
        payload,
    }),
    fetchArticleSearchResultsSuccess: (error) => ({
        type: types.FETCH_ARTICLE_SEARCH_RESULTS_ERROR,
        error,
    }),
    //author
    fetchAuthorSearchResults: (searchTerm) => ({
        type: types.FETCH_AUTHOR_SEARCH_RESULTS,
        searchTerm,
    }),
    fetchAuthorSearchResultsRequest: () => ({
        type: types.FETCH_AUTHOR_SEARCH_RESULTS_REQUEST,
    }),
    fetchAuthorSearchResultsSuccess: (payload) => ({
        type: types.FETCH_AUTHOR_SEARCH_RESULTS_SUCCESS,
        payload,
    }),
    fetchAuthorSearchResultsSuccess: (error) => ({
        type: types.FETCH_AUTHOR_SEARCH_RESULTS_ERROR,
        error,
    }),
}
