// action types
export const SET_NOTIFICATION_CATEGORIES = 'SET_NOTIFICATION_CATEGORIES'
export const CHECK_NOTIFICATION_SETTINGS = 'CHECK_NOTIFICATION_SETTINGS'
export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS'
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS'
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'



// NOTIFICATIONS

export function setNotificationCategories(payload) {
    return {
        type: SET_NOTIFICATION_CATEGORIES,
        payload
    }
}

export function checkNotificationSettings() {
    return {
        type: CHECK_NOTIFICATION_SETTINGS
    }
}

export function fetchNotifications(payload) {
    return {
        type: FETCH_NOTIFICATIONS,
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
export function addNotification(payload) {
    return {
        type: ADD_NOTIFICATION,
        payload
    }
}
export function removeNotification(payload) {
    return {
        type: REMOVE_NOTIFICATION,
        payload
    }
}