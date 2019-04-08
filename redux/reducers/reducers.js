import merge from 'lodash/merge';
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
      items: []
    },
    action
  ) {
    switch (action.type) {
      case 'INVALIDATE_ARTICLE':
        return Object.assign({}, state, {
          didInvalidate: true
        })
      case 'REQUEST_ARTICLES':
        return Object.assign({}, state, {
          isFetching: true,
          didInvalidate: false
        })
      case 'RECEIVE_ARTICLES':
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: false,
          items: action.response.result,
          lastUpdated: action.receivedAt
        })
      default:
        return state
    }
  }

export function articlesByCategory(state = {}, action) {
    switch (action.type) {
        case 'INVALIDATE_CATEGORY':
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


