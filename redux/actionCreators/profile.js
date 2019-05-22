// ACTION TYPES

export const FETCH_PROFILES = 'FETCH_PROFILES'
export const REQUEST_PROFILES = 'REQUEST_PROFILES'
export const RECEIVE_PROFILES = 'RECEIVE_PROFILES'


// PROFILE ACTIONS

export function fetchProfiles(domain, year) {
    return {
        type: FETCH_PROFILES,
        domain,
        year
    }
}

export function requestProfiles() {
    return {
        type: REQUEST_PROFILES,
    }
}

export function receiveProfiles(profiles) {
    return {
        type: RECEIVE_PROFILES,
        profiles
    }
}