export const types = {
    FETCH_PAGE: 'FETCH_PAGE',
    FETCH_PAGE_REQUEST: 'FETCH_PAGE_REQUEST',
    FETCH_PAGE_SUCCESS: 'FETCH_PAGE_SUCCESS',
    FETCH_PAGE_ERROR: 'FETCH_PAGE_ERROR',
}

export default function pages(
    state = {
        items: [],
        single: {},
        error: '',
    },
    action
) {
    switch (action.type) {
        case types.FETCH_PAGE_SUCCESS:
            return {
                ...state,
                single: action.page,
            }
        default:
            return state
    }
}

export const actions = {
    fetchPage(pageId) {
        return {
            type: types.FETCH_PAGE,
            pageId,
        }
    },
    fetchPageRequest() {
        return {
            type: types.FETCH_PAGE_REQUEST,
        }
    },
    fetchPageSuccess(page) {
        return {
            type: types.FETCH_PAGE_SUCCESS,
            page,
        }
    },
    fetchPageError(error) {
        return {
            type: types.FETCH_PAGE_ERROR,
            error,
        }
    },
}
