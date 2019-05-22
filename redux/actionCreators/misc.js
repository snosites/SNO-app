// ACTION TYPES

// comments
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS'
export const REFETCH_COMMENTS = 'REFETCH_COMMENTS'
export const ADD_COMMENT = 'ADD_COMMENT'

// theme
export const SAVE_THEME = 'SAVE_THEME'

// errors
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'



// COMMENTS

export function updateComments(payload) {
    return {
        type: UPDATE_COMMENTS,
        payload
    }
}

export function refetchComments(domain, articleId) {
    return {
        type: REFETCH_COMMENTS,
        domain,
        articleId
    }
}

export function addComment(payload) {
    return {
        type: ADD_COMMENT,
        payload
    }
}


// THEME

export function saveTheme(theme) {
    return { type: SAVE_THEME, theme}
}


// ERRORS

export function setError(payload) {
    return { type: SET_ERROR, payload}
}

export function clearError() {
    return { type: CLEAR_ERROR }
}