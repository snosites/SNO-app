// ACTION TYPES

export const FETCH_PROFILES = 'FETCH_PROFILES'
export const REQUEST_PROFILES = 'REQUEST_PROFILES'
export const RECEIVE_PROFILES = 'RECEIVE_PROFILES'
export const FETCH_PROFILE_ARTICLES = 'FETCH_PROFILE_ARTICLES'
export const SET_PROFILE_ARTICLES = 'SET_PROFILE_ARTICLES'
export const CLEAR_PROFILE_ARTICLES = 'CLEAR_PROFILE_ARTICLES'
export const CLEAR_PROFILE_ERROR = 'CLEAR_PROFILE_ERROR'
export const SET_PROFILE_ARTICLE_ERROR = 'SET_PROFILE_ARTICLE_ERROR'





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

export function fetchProfileArticles(url, writerName) {
    return {
        type: FETCH_PROFILE_ARTICLES,
        url,
        writerName
    }
}

export function setProfileArticles(payload) {
    return {
        type: SET_PROFILE_ARTICLES,
        payload
    }
}

export function clearProfileArticles() {
    return {
        type: CLEAR_PROFILE_ARTICLES
    }
}

export function setProfileArticleError(payload) {
    return {
        type: SET_PROFILE_ARTICLE_ERROR,
        payload
    }
}

export function clearProfileError() {
    return {
        type: CLEAR_PROFILE_ERROR
    }
}