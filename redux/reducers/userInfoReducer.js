import {
    SAVE_USERINFO,
    SAVE_TOKEN_ID,
    SET_ALL_NOTIFICATIONS,
    SET_FROM_PUSH,
    SET_API_KEY,
    SET_COMMENT_POSTED,
    CLEARING_SETTINGS,
    RESET_SETTINGS
} from '../actionCreators/userInfo'


export function userInfo(state = {
    username: '',
    email: '',
    tokenId: '',
    apiKey: '',
    fromPush: false,
    allNotifications: {},
    commentPosted: false,
    deletedInfo: false,
    resetSettings: false
}, action) {
    switch (action.type) {
        case SAVE_USERINFO:
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
            }
        case SAVE_TOKEN_ID:
            return {
                ...state,
                tokenId: action.tokenId
            }
        case SET_ALL_NOTIFICATIONS:
            return {
                ...state,
                allNotifications: {
                    ...state.allNotifications,
                    [action.domainId]: action.allNotifications
                }
            }
        case SET_FROM_PUSH:
            return {
                ...state,
                fromPush: action.payload
            }
        case SET_API_KEY:
            return {
                ...state,
                apiKey: action.payload
            }
        case SET_COMMENT_POSTED:
            return {
                ...state,
                commentPosted: action.payload
            }
        case CLEARING_SETTINGS:
            return {
                ...state,
                clearingSettings: action.payload
            }
        case RESET_SETTINGS:
            return {
                ...state,
                resetSettings: true
            }
        default:
            return state
    }
}