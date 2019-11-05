export const types = {
    FIND_OR_CREATE_USER: 'FIND_OR_CREATE_USER',
    FIND_OR_CREATE_USER_REQUEST: 'FIND_OR_CREATE_USER_REQUEST',
    FIND_OR_CREATE_USER_SUCCESS: 'FIND_OR_CREATE_USER_SUCCESS',
    FIND_OR_CREATE_USER_ERROR: 'FIND_OR_CREATE_USER_ERROR',
    SUBSCRIBE: 'SUBSCRIBE',
    SUBSCRIBE_REQUEST: 'SUBSCRIBE_REQUEST',
    SUBSCRIBE_SUCCESS: 'SUBSCRIBE_SUCCESS',
    SUBSCRIBE_ERROR: 'SUBSCRIBE_ERROR',
    SET_SUBSCRIBE_ALL: 'SET_SUBSCRIBE_ALL',

    SAVE_TOKEN_ID: 'SAVE_TOKEN_ID',
    DELETE_USER: 'DELETE_USER',
    SET_FROM_PUSH: 'SET_FROM_PUSH',
    SET_COMMENT_POSTED: 'SET_COMMENT_POSTED',
    CLEARING_SETTINGS: 'CLEARING_SETTINGS',
    RESET_SETTINGS: 'RESET_SETTINGS'
}

const initialState = {
    username: '',
    email: '',
    subscribeAll: false,
    user: {}
}

export default function user(state = initialState, action) {
    switch (action.type) {
        // case types.SAVE_USERINFO:
        //     return {
        //         ...state,
        //         username: action.payload.username,
        //         email: action.payload.email
        //     }
        case types.FIND_OR_CREATE_USER_SUCCESS:
            return {
                ...state,
                user: action.user
            }
        case types.SET_SUBSCRIBE_ALL:
            return {
                ...state,
                subscribeAll: action.payload
            }
        default:
            return state
    }
}

export const actions = {
    findOrCreateUser: () => ({ type: types.FIND_OR_CREATE_USER }),
    findOrCreateUserRequest: () => ({ type: types.FIND_OR_CREATE_USER_REQUEST }),
    findOrCreateUserSuccess: user => ({ type: types.FIND_OR_CREATE_USER_SUCCESS, user }),
    findOrCreateUserError: error => ({ type: types.FIND_OR_CREATE_USER_ERROR, error }),
    subscribe: payload => ({ type: types.SUBSCRIBE, payload }),
    subscribeRequest: () => ({ type: types.SUBSCRIBE_REQUEST }),
    subscribeSuccess: () => ({ type: types.SUBSCRIBE_SUCCESS }),
    subscribeError: error => ({ type: types.SUBSCRIBE_ERROR, error }),
    setSubscribeAll: payload => ({ type: types.SET_SUBSCRIBE_ALL, payload })
}

//selectors
export const getApiToken = state => state.user.user.api_token
