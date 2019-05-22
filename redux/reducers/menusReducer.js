import {
    REQUEST_MENUS,
    RECEIVE_MENUS,
    RECEIVE_SPLASH,
} from '../actionCreators/menu'


export function menus(state = {
    isLoaded: false,
    items: []
}, action) {
    switch (action.type) {
        case REQUEST_MENUS:
            return {
                ...state,
                isLoaded: false
            }
        case RECEIVE_MENUS:
            return {
                ...state,
                isLoaded: true,
                items: action.response.menus,
                header: action.response.header,
                headerSmall: action.response.headerSmall,
            }
        case RECEIVE_SPLASH:
            return {
                ...state,
                splashScreen: action.splash,
            }
        default:
            return state
    }
}