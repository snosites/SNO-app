export const types = {
    CREATE_USER: 'CREATE_USER',
    CREATE_USER_REQUEST: 'CREATE_USER_REQUEST',
    CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
    CREATE_USER_ERROR: 'CREATE_USER_ERROR',

    SAVE_TOKEN_ID: 'SAVE_TOKEN_ID',
    DELETE_USER: 'DELETE_USER',
    SET_ALL_NOTIFICATIONS: 'SET_ALL_NOTIFICATIONS',
    SET_FROM_PUSH: 'SET_FROM_PUSH',
    SET_COMMENT_POSTED: 'SET_COMMENT_POSTED',
    CLEARING_SETTINGS: 'CLEARING_SETTINGS',
    RESET_SETTINGS: 'RESET_SETTINGS'
}

const initialState = {
    username: '',
    email: '',
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
        case types.CREATE_USER_SUCCESS:
            return {
                ...state,
                user: action.user
            }
        default:
            return state
    }
}

export const actions = {
    createUser: () => ({ type: types.CREATE_USER }),
    createUserRequest: () => ({ type: types.CREATE_USER_REQUEST }),
    createUserSuccess: user => ({ type: types.CREATE_USER_SUCCESS, user }),
    createUserError: error => ({ type: types.CREATE_USER_ERROR, error }),
}

//selectors
export const getApiToken = state => state.user.user.api_token
