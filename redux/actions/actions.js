
// action types

export const ADD_DOMAIN = 'ADD_DOMAIN'
export const DELETE_DOMAIN = 'DELETE_DOMAIN'
export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS' 


// action creators

export function addDomain(payload) {
    return { type: ADD_DOMAIN, payload}
}

export function deleteDomain(domain) {
    return { type: DELETE_DOMAIN, domain }
}

export function changeActiveDomain(id) {
    return { type: 'CHANGE_ACTIVE_DOMAIN', id}
}

export function setActiveDomain(domainObj) {
    return { type: 'SET_ACTIVE_DOMAIN', domainObj}
}

export function toggleNotifications(id) {
    return { type: TOGGLE_NOTIFICATIONS, id}
}

export function saveArticle(article) {
    return { type: 'SAVE_ARTICLE', article}
}

// export function setDomains(payload){
//     return { type: 'SET_DOMAINS', payload}
// }

// export function fetchDomains(payload){
//     return { type: 'FETCH_DOMAINS'}
// }