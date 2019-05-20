
// action types

export const ADD_DOMAIN = 'ADD_DOMAIN'
export const DELETE_DOMAIN = 'DELETE_DOMAIN'
export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS' 


// action creators

// INITIALIZATION

export function fetchAvailableDomains() {
    return { type: "FETCH_AVAILABLE_DOMAINS"}
}

export function searchAvailableDomains(searchTerm) {
    return { type: 'SEARCH_AVAILABLE_DOMAINS', searchTerm}
}

export function setAvailableDomains(domains) {
    return { type: 'SET_AVAILABLE_DOMAINS', domains}
}

export function clearAvailableDomains() {
    return { type: 'CLEAR_AVAILABLE_DOMAINS'}
}

export function initialize(domain, domainId) {
    return {
        type: 'INITIALIZE',
        domain,
        domainId
    }
}

// USERS SAVED DOMAINS

export function addDomain(payload) {
    return { type: ADD_DOMAIN, payload}
}

export function deleteDomain(domainId) {
    return { type: DELETE_DOMAIN, domainId }
}

export function changeActiveDomain(id) {
    return { type: 'CHANGE_ACTIVE_DOMAIN', id}
}

export function setActiveDomain(domainObj) {
    return { type: 'SET_ACTIVE_DOMAIN', domainObj}
}


// NOTIFICATIONS

export function setNotificationCategories(payload) {
    return {
        type: 'SET_NOTIFICATION_CATEGORIES',
        payload
    }
}

export function checkNotificationSettings() {
    return {
        type: 'CHECK_NOTIFICATION_SETTINGS'
    }
}

export function fetchNotifications(payload) {
    return {
        type: 'FETCH_NOTIFICATIONS',
        payload
    }
}

export function setNotifications(notifications, domain) {
    return {
        type: 'SET_NOTIFICATIONS',
        notifications,
        domain
    }
}
export function addNotification(payload) {
    return {
        type: 'ADD_NOTIFICATION',
        payload
    }
}
export function removeNotification(payload) {
    return {
        type: 'REMOVE_NOTIFICATION',
        payload
    }
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

export function fetchMenus(domain, domainId) {
    return {
        type: 'FETCH_MENUS',
        domain,
        domainId
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

// SEARCH ARTICLES

export function invalidateSearchArticles() {
    return {
        type: 'INVALIDATE_SEARCH_ARTICLES',
    }
}

export function fetchSearchArticlesIfNeeded(domain, searchTerm) {
    return {
        type: 'FETCH_SEARCH_ARTICLES_IF_NEEDED',
        domain,
        searchTerm
    }
}

export function fetchMoreSearchArticlesIfNeeded(domain, searchTerm) {
    return {
        type: 'FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED',
        domain,
        searchTerm
    }
}

export function requestSearchArticles() {
    return {
        type: 'REQUEST_SEARCH_ARTICLES',
    }
}

export function receiveSearchArticles(response) {
    return {
        type: 'RECEIVE_SEARCH_ARTICLES',
        response,
        receivedAt: Date.now()
    }
}

export function fetchSearchArticlesFailure(error) {
    return {
        type: 'FETCH_SEARCH_ARTICLES_FAILURE',
        error,
        recievedAt: Date.now()
    }
}

// COMMENTS

export function updateComments(payload) {
    return {
        type: 'UPDATE_COMMENTS',
        payload
    }
}

export function refetchComments(domain, articleId) {
    return {
        type: 'REFETCH_COMMENTS',
        domain,
        articleId
    }
}

export function addComment(payload) {
    return {
        type: 'ADD_COMMENT',
        payload
    }
}

// USER INFO

export function saveUserInfo(payload) {
    return {
        type: 'SAVE_USERINFO', 
        payload
    }
}

export function getApiKey() {
    return {
        type: 'GET_API_KEY'
    }
}

export function setApiKey(payload) {
    return {
        type: 'SET_API_KEY',
        payload
    }
}

export function saveTokenId(tokenId) {
    return {
        type: 'SAVE_TOKEN_ID',
        tokenId
    }
}

export function deleteUser(tokenId, apiKey) {
    return {
        type: 'DELETE_USER',
        tokenId,
        apiKey
    }
}

export function setAllNotifications(domainId, allNotifications) {
    return {
        type: 'SET_ALL_NOTIFICATIONS',
        domainId,
        allNotifications
    }
}

export function setFromPush(payload) {
    return {
        type: 'SET_FROM_PUSH',
        payload
    }
}

// SAVED ARTICLES SCREEN

export function saveArticle(article, schoolId) {
    return { type: 'SAVE_ARTICLE', article, school: schoolId}
}

export function removeSavedArticle(articleId, schoolId) {
    return { type: 'REMOVE_SAVED_ARTICLE', articleId, school: schoolId}
}

export function initializeSaved(schoolId) {
    return { type: 'INITIALIZE_SAVED', school: schoolId }
}

// THEME

export function saveTheme(theme) {
    return { type: 'SAVE_THEME', theme}
}

// ERRORS

export function setError(payload) {
    return { type: 'SET_ERROR', payload}
}

export function clearError() {
    return { type: 'CLEAR_ERROR' }
}
