// action types
export const CHECK_NOTIFICATION_SETTINGS = 'CHECK_NOTIFICATION_SETTINGS'
export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS'
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'



// NOTIFICATIONS

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