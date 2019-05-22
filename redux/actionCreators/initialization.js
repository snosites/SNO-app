// action types
export const FETCH_AVAILABLE_DOMAINS = 'FETCH_AVAILABLE_DOMAINS'
export const SEARCH_AVAILABLE_DOMAINS = 'SEARCH_AVAILABLE_DOMAINS'
export const SET_AVAILABLE_DOMAINS = 'SET_AVAILABLE_DOMAINS' 
export const CLEAR_AVAILABLE_DOMAINS = 'CLEAR_AVAILABLE_DOMAINS' 
export const INITIALIZE = 'INITIALIZE' 



// INITIALIZATION

export function fetchAvailableDomains() {
    return { type: FETCH_AVAILABLE_DOMAINS }
}

export function searchAvailableDomains(searchTerm) {
    return { type: SEARCH_AVAILABLE_DOMAINS, searchTerm }
}

export function setAvailableDomains(domains) {
    return { type: SET_AVAILABLE_DOMAINS, domains }
}

export function clearAvailableDomains() {
    return { type: CLEAR_AVAILABLE_DOMAINS }
}

export function initialize(domain, domainId) {
    return {
        type: INITIALIZE,
        domain,
        domainId
    }
}