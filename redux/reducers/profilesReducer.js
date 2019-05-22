import {
    REQUEST_PROFILES,
    RECEIVE_PROFILES
} from '../actionCreators/profile'

export function profiles(state = {
    isLoaded: false,
    items: []
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
        default:
            return state
    }
}