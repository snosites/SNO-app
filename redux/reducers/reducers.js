import {
    ADD_DOMAIN,
    DELETE_DOMAIN,
    TOGGLE_NOTIFICATIONS
} from '../actions/actions';

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


