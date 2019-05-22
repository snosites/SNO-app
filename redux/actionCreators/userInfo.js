// ACTION TYPES

export const SAVE_USERINFO = 'SAVE_USERINFO'
export const GET_API_KEY = 'GET_API_KEY'
export const SET_API_KEY = 'SET_API_KEY'
export const SAVE_TOKEN_ID = 'SAVE_TOKEN_ID'
export const DELETE_USER = 'DELETE_USER'
export const SET_ALL_NOTIFICATIONS = 'SET_ALL_NOTIFICATIONS'
export const SET_FROM_PUSH = 'SET_FROM_PUSH'
export const SET_COMMENT_POSTED = 'SET_COMMENT_POSTED'
export const CLEARING_SETTINGS = 'CLEARING_SETTINGS'
export const RESET_SETTINGS = 'RESET_SETTINGS'



// USER INFO

export function saveUserInfo(payload) {
    return {
        type: SAVE_USERINFO, 
        payload
    }
}

export function getApiKey() {
    return {
        type: GET_API_KEY
    }
}

export function setApiKey(payload) {
    return {
        type: SET_API_KEY,
        payload
    }
}

export function saveTokenId(tokenId) {
    return {
        type: SAVE_TOKEN_ID,
        tokenId
    }
}

export function deleteUser(tokenId, apiKey) {
    return {
        type: DELETE_USER,
        tokenId,
        apiKey
    }
}

export function setAllNotifications(domainId, allNotifications) {
    return {
        type: SET_ALL_NOTIFICATIONS,
        domainId,
        allNotifications
    }
}

export function setFromPush(payload) {
    return {
        type: SET_FROM_PUSH,
        payload
    }
}

export function setCommentPosted(payload) {
    return {
        type: SET_COMMENT_POSTED,
        payload
    }
}

export function clearingSettings(payload) {
    return {
        type: CLEARING_SETTINGS,
        payload
    }
}

export function resetSettings() {
    return { type: RESET_SETTINGS }
}
