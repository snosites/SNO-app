// action types
export const ADD_DOMAIN = 'ADD_DOMAIN'
export const DELETE_DOMAIN = 'DELETE_DOMAIN'
export const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
export const SET_ACTIVE_DOMAIN = 'SET_ACTIVE_DOMAIN'



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