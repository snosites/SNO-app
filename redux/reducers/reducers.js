import merge from 'lodash/merge';
import union from 'lodash/union';

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
        case 'TOGGLE_NOTIFICATIONS':
            return state.map(domain => {
                if (domain.id === action.id) {
                    return {
                        ...domain,
                        notifications: !domain.notifications
                    }
                }
                return {
                    ...domain,
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
                items: action.response
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
    return state
}

function articles(
    state = {
        isFetching: false,
        didInvalidate: false,
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
            if(state.didInvalidate){
                newItems = action.response.result;
            }
            else if(!state.didInvalidate) {
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

