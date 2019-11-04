export const types = {
           SET_ACTIVE_DOMAIN: 'SET_ACTIVE_DOMAIN',
           ADD_DOMAIN: 'ADD_DOMAIN',

           DELETE_DOMAIN: 'DELETE_DOMAIN',
           SET_NOTIFICATION_CATEGORIES: 'SET_NOTIFICATION_CATEGORIES',
           SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
           
       }

export default function domains(state = [], action) {
    switch (action.type) {
        case types.ADD_DOMAIN:
            return [
                ...state,
                action.payload
            ]
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
        case types.SET_NOTIFICATIONS:
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
           setActiveDomain: domainId => {
               return { type: types.SET_ACTIVE_DOMAIN, domainId }
           },
           addDomain: payload => {
               return { type: types.ADD_DOMAIN, payload }
           },
           
           deleteDomain: domainId => {
               return { type: types.DELETE_DOMAIN, domainId }
           },

           setNotificationCategories: payload => {
               return {
                   type: types.SET_NOTIFICATION_CATEGORIES,
                   payload
               }
           },
           setNotifications: (notifications, domain) => {
               return {
                   type: types.SET_NOTIFICATIONS,
                   notifications,
                   domain
               }
           }
       }

//selectors 
export const getActiveDomain = state => state.domains.find(domain => domain.active === true)