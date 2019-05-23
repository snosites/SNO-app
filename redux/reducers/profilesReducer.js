import {
    REQUEST_PROFILES,
    RECEIVE_PROFILES,
    SET_PROFILE_ARTICLES,
    CLEAR_PROFILE_ARTICLES,
    CLEAR_PROFILE_ERROR,
    SET_PROFILE_ARTICLE_ERROR
} from '../actionCreators/profile'

export function profiles(state = {
    isLoaded: false,
    items: [],
    articles: [],
    error: ''
}, action) {
    switch (action.type) {
        case REQUEST_PROFILES:
            return {
                ...state,
                isLoaded: false
            }
        case RECEIVE_PROFILES:
            return {
                ...state,
                isLoaded: true,
                items: action.profiles
            }
        case SET_PROFILE_ARTICLES:
            return {
                ...state,
                articles: action.payload
            }
        case CLEAR_PROFILE_ARTICLES:
            return {
                ...state,
                articles: []
            }
        case SET_PROFILE_ARTICLE_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case CLEAR_PROFILE_ERROR:
            return {
                ...state,
                error: ''
            }
        default:
            return state
    }
}