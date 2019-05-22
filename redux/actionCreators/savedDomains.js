// action types
export const ADD_DOMAIN = 'ADD_DOMAIN'
export const DELETE_DOMAIN = 'DELETE_DOMAIN'
export const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
export const SET_ACTIVE_DOMAIN = 'SET_ACTIVE_DOMAIN'
export const SET_NOTIFICATION_CATEGORIES = 'SET_NOTIFICATION_CATEGORIES'
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS'


// USERS SAVED DOMAINS

export function addDomain(payload) {
    return { type: ADD_DOMAIN, payload }
}

export function deleteDomain(domainId) {
    return { type: DELETE_DOMAIN, domainId }
}

export function changeActiveDomain(id) {
    return { type: CHANGE_ACTIVE_DOMAIN, id }
}

export function setActiveDomain(domainObj) {
    return { type: SET_ACTIVE_DOMAIN, domainObj }
}

export function setNotificationCategories(payload) {
    return {
        type: SET_NOTIFICATION_CATEGORIES,
        payload
    }
}

export function setNotifications(notifications, domain) {
    return {
        type: SET_NOTIFICATIONS,
        notifications,
        domain
    }
}