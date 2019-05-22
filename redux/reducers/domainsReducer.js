import {
    ADD_DOMAIN,
    DELETE_DOMAIN,
    CHANGE_ACTIVE_DOMAIN,
    SET_NOTIFICATION_CATEGORIES,
    SET_NOTIFICATIONS
} from '../actionCreators/savedDomains';



export function domains(state = [], action) {
    switch (action.type) {
        case ADD_DOMAIN:
            return [
                ...state,
                {
                    ...action.payload
                }

            ]
        case DELETE_DOMAIN:
            return state.filter(domain => {
                return domain.id !== action.domainId
            })
        case CHANGE_ACTIVE_DOMAIN:
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
        case SET_NOTIFICATION_CATEGORIES:
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
        case SET_NOTIFICATIONS:
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