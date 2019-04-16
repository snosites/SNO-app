
// action types

export const ADD_DOMAIN = 'ADD_DOMAIN'
export const DELETE_DOMAIN = 'DELETE_DOMAIN'
export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS' 


// action creators

// USERS SAVED DOMAINS

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


// NOTIFICATIONS

export function toggleNotifications(id) {
    return { type: TOGGLE_NOTIFICATIONS, id}
}

// ARTICLE ACTIONS

export function selectCategory(category) {
    return {
        type: 'SELECT_CATEGORY',
        category
    }
}

export function invalidateArticles(category) {
    return {
        type: 'INVALIDATE_ARTICLES',
        category
    }
}

export function fetchArticlesIfNeeded(payload) {
    return {
        type: 'FETCH_ARTICLES_IF_NEEDED',
        payload
    }
}

export function fetchMoreArticlesIfNeeded(payload) {
    return {
        type: 'FETCH_MORE_ARTICLES_IF_NEEDED',
        payload
    }
}

export function requestArticles(category) {
    return {
        type: 'REQUEST_ARTICLES',
        category,
    }
}

export function receiveArticles(category, response) {
    return {
        type: 'RECEIVE_ARTICLES',
        category,
        response,
        receivedAt: Date.now()
    }
}

export function fetchArticlesFailure(category, error) {
    return {
        type: 'FETCH_ARTICLES_FAILURE',
        category,
        error,
        recievedAt: Date.now()
    }
}

// MENU ACTIONS

export function fetchMenus(domain) {
    return {
        type: 'FETCH_MENUS',
        domain
    }
}

export function requestMenus() {
    return {
        type: 'REQUEST_MENUS',
    }
}

export function receiveMenus(response) {
    return {
        type: 'RECEIVE_MENUS',
        response,
    }
}

// PROFILE ACTIONS

export function fetchProfiles(domain) {
    return {
        type: 'FETCH_PROFILES',
        domain
    }
}

export function requestProfiles() {
    return {
        type: 'REQUEST_PROFILES',
    }
}

export function receiveProfiles(profiles) {
    return {
        type: 'RECEIVE_PROFILES',
        profiles
    }
}

// RECENT ARTICLES

export function invalidateRecentArticles() {
    return {
        type: 'INVALIDATE_RECENT_ARTICLES',
    }
}

export function fetchRecentArticlesIfNeeded(domain) {
    return {
        type: 'FETCH_RECENT_ARTICLES_IF_NEEDED',
        domain
    }
}

export function fetchMoreRecentArticlesIfNeeded(domain) {
    return {
        type: 'FETCH_MORE_RECENT_ARTICLES_IF_NEEDED',
        domain
    }
}

export function requestRecentArticles() {
    return {
        type: 'REQUEST_RECENT_ARTICLES',
    }
}

export function receiveRecentArticles(response) {
    return {
        type: 'RECEIVE_RECENT_ARTICLES',
        response,
        receivedAt: Date.now()
    }
}

export function fetchRecentArticlesFailure(error) {
    return {
        type: 'FETCH_RECENT_ARTICLES_FAILURE',
        error,
        recievedAt: Date.now()
    }
}

export function saveUserInfo(payload) {
    return {
        type: 'SAVE_USERINFO', 
        payload
    }
}

export function saveArticle(article) {
    return { type: 'SAVE_ARTICLE', article}
}
