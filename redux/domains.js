export const types = {
    LOAD_ACTIVE_DOMAIN: 'LOAD_ACTIVE_DOMAIN',
    LOAD_ACTIVE_DOMAIN_REQUEST: 'LOAD_ACTIVE_DOMAIN_REQUEST',
    LOAD_ACTIVE_DOMAIN_SUCCESS: 'LOAD_ACTIVE_DOMAIN_SUCCESS',
    LOAD_ACTIVE_DOMAIN_ERROR: 'LOAD_ACTIVE_DOMAIN_ERROR',
    SET_ACTIVE_DOMAIN: 'SET_ACTIVE_DOMAIN',
    ADD_DOMAIN: 'ADD_DOMAIN',
    DELETE_DOMAIN: 'DELETE_DOMAIN',
    SET_NOTIFICATION_CATEGORIES: 'SET_NOTIFICATION_CATEGORIES',
    SET_NOTIFICATIONS: 'SET_NOTIFICATIONS'
}

export default function domains(state = [], action) {
    switch (action.type) {
        case types.ADD_DOMAIN:
            return [...state, action.payload]
        case types.DELETE_DOMAIN:
            return state.filter(domain => {
                return domain.id !== action.domainId
            })
        case types.SET_ACTIVE_DOMAIN:
            return state.map(domain => {
                if (domain.id === action.domainId) {
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
        case types.SET_NOTIFICATION_CATEGORIES:
            return state.map(domain => {
                if (domain.id === action.domainId) {
                    return {
                        ...domain,
                        notificationCategories: action.notificationCategories
                    }
                }
                return domain
            })
        case types.SET_NOTIFICATIONS:
            return state.map(domain => {
                if (domain.id === action.domainId) {
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
                            return notification
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

export const actions = {
    loadActiveDomain: () => ({ type: types.LOAD_ACTIVE_DOMAIN }),
    loadActiveDomainRequest: () => ({ type: types.LOAD_ACTIVE_DOMAIN_REQUEST }),
    loadActiveDomainSuccess: () => ({ type: types.LOAD_ACTIVE_DOMAIN_SUCCESS }),
    loadActiveDomainError: error => ({ type: types.LOAD_ACTIVE_DOMAIN_ERROR, error }),
    setActiveDomain: domainId => {
        return { type: types.SET_ACTIVE_DOMAIN, domainId }
    },
    addDomain: payload => {
        return { type: types.ADD_DOMAIN, payload }
    },

    deleteDomain: domainId => {
        return { type: types.DELETE_DOMAIN, domainId }
    },

    setNotificationCategories: (domainId, notificationCategories) => {
        return {
            type: types.SET_NOTIFICATION_CATEGORIES,
            domainId,
            notificationCategories
        }
    },
    setNotifications: (domainId, notifications) => {
        return {
            type: types.SET_NOTIFICATIONS,
            domainId,
            notifications
        }
    }
}

//selectors
export const getActiveDomain = state => {
    const found = state.domains.find(domain => domain.active === true)
    if (found) {
        return found
    } else {
        return {}
    }
}
export const getSavedDomains = state => state.domains
