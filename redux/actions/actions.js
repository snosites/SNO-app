
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

export function invalidateCategory(category) {
    return {
        type: 'INVALIDATE_CATEGORY',
        category
    }
}

export function fetchArticles(payload) {
    return {
        type: 'FETCH_ARTICLES',
        payload
    }
}

export function setArticles(category, response) {
    return {
        type: 'SET_ARTICLES',
        category,
        articles: response,
        recievedAt: Date.now()
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

export function saveArticle(article) {
    return { type: 'SAVE_ARTICLE', article}
}
