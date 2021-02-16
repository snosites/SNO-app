export const types = {
    FIND_OR_CREATE_USER: 'FIND_OR_CREATE_USER',
    FIND_OR_CREATE_USER_REQUEST: 'FIND_OR_CREATE_USER_REQUEST',
    FIND_OR_CREATE_USER_SUCCESS: 'FIND_OR_CREATE_USER_SUCCESS',
    FIND_OR_CREATE_USER_ERROR: 'FIND_OR_CREATE_USER_ERROR',
    UPDATE_USER: 'UPDATE_USER',
    UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
    UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
    UPDATE_USER_ERROR: 'UPDATE_USER_ERROR',
    SUBSCRIBE: 'SUBSCRIBE',
    SUBSCRIBE_REQUEST: 'SUBSCRIBE_REQUEST',
    SUBSCRIBE_SUCCESS: 'SUBSCRIBE_SUCCESS',
    SUBSCRIBE_ERROR: 'SUBSCRIBE_ERROR',
    UNSUBSCRIBE: 'UNSUBSCRIBE',
    UNSUBSCRIBE_REQUEST: 'UNSUBSCRIBE_REQUEST',
    UNSUBSCRIBE_SUCCESS: 'UNSUBSCRIBE_SUCCESS',
    UNSUBSCRIBE_ERROR: 'UNSUBSCRIBE_ERROR',
    SET_SUBSCRIBE_ALL: 'SET_SUBSCRIBE_ALL',
    SET_USER: 'SET_USER',
    SAVE_USERINFO: 'SAVE_USERINFO',
    DELETE_USER: 'DELETE_USER',
    DELETE_USER_REQUEST: 'DELETE_USER_REQUEST',
    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_ERROR: 'DELETE_USER_ERROR',
    CLEARING_SETTINGS: 'CLEARING_SETTINGS',
    SET_WRITER_SUBSCRIPTIONS: 'SET_WRITER_SUBSCRIPTIONS',
    SET_FROM_PUSH: 'SET_FROM_PUSH',
    RESET_SETTINGS: 'RESET_SETTINGS',
    SET_FIRST_INSTALL: 'SET_FIRST_INSTALL',
    FETCH_UNREAD_STORIES: 'FETCH_UNREAD_STORIES',
    FETCH_UNREAD_STORIES_REQUEST: 'FETCH_UNREAD_STORIES_REQUEST',
    FETCH_UNREAD_STORIES_SUCCESS: 'FETCH_UNREAD_STORIES_SUCCESS',
    FETCH_UNREAD_STORIES_ERROR: 'FETCH_UNREAD_STORIES_ERROR',
}

const initialState = {
    username: '',
    email: '',
    subscribeAll: false,
    user: {},
    writerSubscriptions: [],
    fromPush: false,
    firstInstall: true,
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case types.SAVE_USERINFO:
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
            }
        case types.SET_USER:
            return {
                ...state,
                user: action.payload,
            }
        case types.FIND_OR_CREATE_USER_SUCCESS:
            return {
                ...state,
                user: action.user,
            }
        case types.FETCH_UNREAD_STORIES_SUCCESS:
            return {
                ...state,
                unreadStories: action.payload,
            }
        case types.FETCH_UNREAD_STORIES_ERROR:
            return {
                ...state,
                unreadStories: [],
            }
        case types.FIND_OR_CREATE_USER_ERROR:
            return {
                ...state,
                user: {},
            }
        case types.SET_SUBSCRIBE_ALL:
            return {
                ...state,
                subscribeAll: action.payload,
            }
        case types.SET_WRITER_SUBSCRIPTIONS:
            return {
                ...state,
                writerSubscriptions: action.payload,
            }
        case types.SET_FROM_PUSH:
            return {
                ...state,
                fromPush: action.payload,
            }
        case types.SET_FIRST_INSTALL:
            return {
                ...state,
                firstInstall: action.payload,
            }
        default:
            return state
    }
}

export const actions = {
    findOrCreateUser: () => ({ type: types.FIND_OR_CREATE_USER }),
    findOrCreateUserRequest: () => ({ type: types.FIND_OR_CREATE_USER_REQUEST }),
    findOrCreateUserSuccess: (user) => ({ type: types.FIND_OR_CREATE_USER_SUCCESS, user }),
    findOrCreateUserError: (error) => ({ type: types.FIND_OR_CREATE_USER_ERROR, error }),
    updateUser: (key, value) => ({ type: types.UPDATE_USER, key, value }),
    updateUserRequest: () => ({ type: types.UPDATE_USER_REQUEST }),
    updateUserSuccess: () => ({ type: types.UPDATE_USER_SUCCESS }),
    updateUserError: (error) => ({ type: types.UPDATE_USER_ERROR, error }),
    subscribe: (payload) => ({ type: types.SUBSCRIBE, payload }),
    subscribeRequest: () => ({ type: types.SUBSCRIBE_REQUEST }),
    subscribeSuccess: () => ({ type: types.SUBSCRIBE_SUCCESS }),
    subscribeError: (error) => ({ type: types.SUBSCRIBE_ERROR, error }),
    unsubscribe: (payload) => ({ type: types.UNSUBSCRIBE, payload }),
    unsubscribeRequest: () => ({ type: types.UNSUBSCRIBE_REQUEST }),
    unsubscribeSuccess: () => ({ type: types.UNSUBSCRIBE_SUCCESS }),
    unsubscribeError: (error) => ({ type: types.UNSUBSCRIBE_ERROR, error }),
    setSubscribeAll: (payload) => ({ type: types.SET_SUBSCRIBE_ALL, payload }),
    setUser: (payload) => ({ type: types.SET_USER, payload }),
    saveUserInfo: (payload) => ({ type: types.SAVE_USERINFO, payload }),
    deleteUser: () => ({ type: types.DELETE_USER }),
    deleteUserRequest: () => ({ type: types.DELETE_USER_REQUEST }),
    deleteUserSuccess: () => ({ type: types.DELETE_USER_SUCCESS }),
    deleteUserError: (error) => ({ type: types.DELETE_USER_ERROR, error }),
    setWriterSubscriptions: (payload) => ({
        type: types.SET_WRITER_SUBSCRIPTIONS,
        payload,
    }),
    setFromPush: (payload) => ({ type: types.SET_FROM_PUSH, payload }),
    setFirstInstall: (payload) => ({
        type: types.SET_FIRST_INSTALL,
        payload,
    }),
    fetchUnreadStories: (payload) => ({ type: types.FETCH_UNREAD_STORIES, payload }),
    fetchUnreadStoriesRequest: () => ({ type: types.FETCH_UNREAD_STORIES_REQUEST }),
    fetchUnreadStoriesSuccess: (payload) => ({ type: types.FETCH_UNREAD_STORIES_SUCCESS, payload }),
    fetchUnreadStoriesError: (error) => ({ type: types.FETCH_UNREAD_STORIES_ERROR, error }),
}

//selectors
export const getApiToken = (state) => state.user.user.api_token
export const getPushToken = (state) => state.user.user.push_token
export const getUser = (state) => state.user.user
export const getSubscribeAll = (state) => state.user.subscribeAll
export const getWriterSubscriptions = (state) => state.user.writerSubscriptions
export const getFromPush = (state) => state.user.fromPush
