import merge from 'lodash/merge';
import union from 'lodash/union';
import { DefaultTheme, Colors } from 'react-native-paper';

import {
    ADD_DOMAIN,
    DELETE_DOMAIN,
    TOGGLE_NOTIFICATIONS
} from '../actions/actions';
import FullArticleScreen from '../../screens/FullArticleScreen';

export function domains(state = [], action) {
    switch (action.type) {
        case ADD_DOMAIN:
            return [
                ...state,
                {
                    ...action.payload
                }

            ]
        case 'CHANGE_ACTIVE_DOMAIN':
            return state.map(domain => {
                if (domain.id === action.id) {
                    return {
                        ...domain,
                        active: true
                    }
                }
                return {
                    ...domain,
                    active: false
                }
            })
        case 'SET_NOTIFICATION_CATEGORIES':
            return state.map(domain => {
                if (domain.id === action.payload.id) {
                    return {
                        ...domain,
                        notificationCategories: action.payload.notificationCategories
                    }
                }
                return {
                    ...domain
                }
            })
        case 'SET_NOTIFICATIONS':
            return state.map(domain => {
                if (domain.id === action.domain) {
                    return {
                        ...domain,
                        notificationCategories: domain.notificationCategories.map(notification => {
                            let found = action.notifications.find(userNotification => {
                                return notification.id === userNotification.id
                            })
                            if (found) {
                                notification.active = true
                            } else {
                                notification.active = false
                            }
                            return notification;
                        })
                    }
                }
                return {
                    ...domain
                }
            })
        default:
            return state
    }
}


export function activeDomain(state = {}, action) {
    switch (action.type) {
        case 'SET_ACTIVE_DOMAIN':
            return action.domainObj
        default:
            return state
    }
}

export function menus(state = {
    isLoaded: false,
    items: []
}, action) {
    switch (action.type) {
        case 'REQUEST_MENUS':
            return {
                ...state,
                isLoaded: false
            }
        case 'RECEIVE_MENUS':
            return {
                ...state,
                isLoaded: true,
                items: action.response.menus,
                header: action.response.header,
                headerSmall: action.response.headerSmall,
                splashScreen: action.response.splashScreen,


            }
        default:
            return state
    }
}

export function profiles(state = {
    isLoaded: false,
    items: []
}, action) {
    switch (action.type) {
        case 'REQUEST_PROFILES':
            return {
                ...state,
                isLoaded: false
            }
        case 'RECEIVE_PROFILES':
            return {
                ...state,
                isLoaded: true,
                items: action.profiles
            }
        default:
            return state
    }
}

export function savedArticles(state = [], action) {
    switch (action.type) {
        case 'SAVE_ARTICLE':
            return [
                ...state,
                action.article
            ]
        case 'REMOVE_SAVED_ARTICLE':
            return state.filter(article => {
                return article.id !== action.articleId
            })
        default:
            return state
    }
}

export function userInfo(state = {
    notifications: {
        all: false,
        categories: []
    }
}, action) {
    switch (action.type) {
        case 'SAVE_USERINFO':
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
            }
        case 'SAVE_TOKEN_ID':
            return {
                ...state,
                tokenId: action.tokenId
            }
        // case 'SET_NOTIFICATIONS':
        //     return {
        //         ...state,
        //         notifications: {
        //             ...state.notifications,
        //             categories: action.notifications
        //         }
        //     }
        default:
            return state
    }
}

// ARTICLES REDUCERS //

// runs every time an action is sent
export function entities(state = { articles: {} }, action) {
    if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities)
    }
    else if (action.type === 'UPDATE_COMMENTS') {
        return merge({}, state, { articles: { [action.payload.articleId]: { comments: action.payload.comments } } })
    }
    return state
}

function articles(
    state = {
        isFetching: false,
        didInvalidate: false,
        refreshing: false,
        page: 1,
        items: []
    },
    action
) {
    switch (action.type) {
        case 'INVALIDATE_ARTICLES':
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case 'REQUEST_ARTICLES':
            return Object.assign({}, state, {
                isFetching: true,
            })
        case 'RECEIVE_ARTICLES':
            let updatedPage = 'max';
            let newItems = [];
            if (action.response.result.length == 10) {
                updatedPage = state.page + 1
            };
            if (state.didInvalidate) {
                newItems = action.response.result;
            }
            else if (!state.didInvalidate) {
                newItems = union(state.items, action.response.result);
            }
            return Object.assign({}, state, {
                categoryId: action.category,
                isFetching: false,
                didInvalidate: false,
                items: newItems,
                lastUpdated: action.receivedAt,
                page: updatedPage
            })
        default:
            return state
    }
}

export function articlesByCategory(state = {}, action) {
    switch (action.type) {
        case 'INVALIDATE_ARTICLES':
        case 'REQUEST_ARTICLES':
        case 'RECEIVE_ARTICLES':
            return {
                ...state,
                [action.category]: articles(state[action.category], action)
            }
        default:
            return state
    }
}

// RECENT ARTICLES

export function recentArticles(state = {
    isFetching: false,
    didInvalidate: false,
    page: 1,
    items: []
}, action) {
    switch (action.type) {
        case 'INVALIDATE_RECENT_ARTICLES':
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case 'REQUEST_RECENT_ARTICLES':
            return Object.assign({}, state, {
                isFetching: true,
            })
        case 'RECEIVE_RECENT_ARTICLES':
            let updatedPage = 'max';
            let newItems = [];
            if (action.response.result.length == 10) {
                updatedPage = state.page + 1
            };
            if (state.didInvalidate) {
                newItems = action.response.result;
            }
            else if (!state.didInvalidate) {
                newItems = union(state.items, action.response.result);
            }
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: newItems,
                lastUpdated: action.receivedAt,
                page: updatedPage
            })
        default:
            return state
    }
}

// SEARCH ARTICLES

export function searchArticles(state = {
    isFetching: false,
    didInvalidate: false,
    page: 1,
    items: []
}, action) {
    switch (action.type) {
        case 'INVALIDATE_SEARCH_ARTICLES':
            return Object.assign({}, state, {
                didInvalidate: true,
                page: 1,
            })
        case 'REQUEST_SEARCH_ARTICLES':
            return Object.assign({}, state, {
                isFetching: true,
            })
        case 'RECEIVE_SEARCH_ARTICLES':
            let updatedPage = 'max';
            let newItems = [];
            if (action.response.result.length == 10) {
                updatedPage = state.page + 1
            };
            if (state.didInvalidate) {
                newItems = action.response.result;
            }
            else if (!state.didInvalidate) {
                newItems = union(state.items, action.response.result);
            }
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: newItems,
                lastUpdated: action.receivedAt,
                page: updatedPage
            })
        default:
            return state
    }
}

// THEME

export function theme(state = {}, action) {
    switch (action.type) {
        case 'SAVE_THEME':
            let mode = true;
            if(action.theme.theme.toLowerCase() == 'light') {
                mode = false;
            }
            return {
                ...DefaultTheme,
                dark: mode,
                roundness: 2,
                colors: {
                    ...DefaultTheme.colors,
                    primary: action.theme.primary,
                    accent: action.theme.accent,
                }
            };
        default:
            return state
    }
}

