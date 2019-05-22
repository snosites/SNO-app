// ACTION TYPES

// articles
export const SELECT_CATEGORY = 'SELECT_CATEGORY'
export const INVALIDATE_ARTICLES = 'INVALIDATE_ARTICLES'
export const FETCH_ARTICLES_IF_NEEDED = 'FETCH_ARTICLES_IF_NEEDED'
export const FETCH_MORE_ARTICLES_IF_NEEDED = 'FETCH_MORE_ARTICLES_IF_NEEDED'
export const REQUEST_ARTICLES = 'REQUEST_ARTICLES'
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES'
export const FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE'

// recent articles
export const INVALIDATE_RECENT_ARTICLES = 'INVALIDATE_RECENT_ARTICLES'
export const FETCH_RECENT_ARTICLES_IF_NEEDED = 'FETCH_RECENT_ARTICLES_IF_NEEDED'
export const FETCH_MORE_RECENT_ARTICLES_IF_NEEDED = 'FETCH_MORE_RECENT_ARTICLES_IF_NEEDED'
export const REQUEST_RECENT_ARTICLES = 'REQUEST_RECENT_ARTICLES'
export const RECEIVE_RECENT_ARTICLES = 'RECEIVE_RECENT_ARTICLES'
export const FETCH_RECENT_ARTICLES_FAILURE = 'FETCH_RECENT_ARTICLES_FAILURE'

// search articles
export const INVALIDATE_SEARCH_ARTICLES = 'INVALIDATE_SEARCH_ARTICLES'
export const FETCH_SEARCH_ARTICLES_IF_NEEDED = 'FETCH_SEARCH_ARTICLES_IF_NEEDED'
export const FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED = 'FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED'
export const REQUEST_SEARCH_ARTICLES = 'REQUEST_SEARCH_ARTICLES'
export const RECEIVE_SEARCH_ARTICLES = 'RECEIVE_SEARCH_ARTICLES'
export const FETCH_SEARCH_ARTICLES_FAILURE = 'FETCH_SEARCH_ARTICLES_FAILURE'

// saved articles
export const SAVE_ARTICLE = 'SAVE_ARTICLE'
export const REMOVE_SAVED_ARTICLE = 'REMOVE_SAVED_ARTICLE'
export const INITIALIZE_SAVED = 'INITIALIZE_SAVED'


// ARTICLES

export function selectCategory(category) {
    return {
        type: SELECT_CATEGORY,
        category
    }
}

export function invalidateArticles(category) {
    return {
        type: INVALIDATE_ARTICLES,
        category
    }
}

export function fetchArticlesIfNeeded(payload) {
    return {
        type: FETCH_ARTICLES_IF_NEEDED,
        payload
    }
}

export function fetchMoreArticlesIfNeeded(payload) {
    return {
        type: FETCH_MORE_ARTICLES_IF_NEEDED,
        payload
    }
}

export function requestArticles(category) {
    return {
        type: REQUEST_ARTICLES,
        category,
    }
}

export function receiveArticles(category, response) {
    return {
        type: RECEIVE_ARTICLES,
        category,
        response,
        receivedAt: Date.now()
    }
}

export function fetchArticlesFailure(category, error) {
    return {
        type: FETCH_ARTICLES_FAILURE,
        category,
        error,
        recievedAt: Date.now()
    }
}

// RECENT ARTICLES

export function invalidateRecentArticles() {
    return {
        type: INVALIDATE_RECENT_ARTICLES,
    }
}

export function fetchRecentArticlesIfNeeded(domain) {
    return {
        type: FETCH_RECENT_ARTICLES_IF_NEEDED,
        domain
    }
}

export function fetchMoreRecentArticlesIfNeeded(domain) {
    return {
        type: FETCH_MORE_RECENT_ARTICLES_IF_NEEDED,
        domain
    }
}

export function requestRecentArticles() {
    return {
        type: REQUEST_RECENT_ARTICLES,
    }
}

export function receiveRecentArticles(response) {
    return {
        type: RECEIVE_RECENT_ARTICLES,
        response,
        receivedAt: Date.now()
    }
}

export function fetchRecentArticlesFailure(error) {
    return {
        type: FETCH_RECENT_ARTICLES_FAILURE,
        error,
        recievedAt: Date.now()
    }
}

// SEARCH ARTICLES

export function invalidateSearchArticles() {
    return {
        type: INVALIDATE_SEARCH_ARTICLES,
    }
}

export function fetchSearchArticlesIfNeeded(domain, searchTerm) {
    return {
        type: FETCH_SEARCH_ARTICLES_IF_NEEDED,
        domain,
        searchTerm
    }
}

export function fetchMoreSearchArticlesIfNeeded(domain, searchTerm) {
    return {
        type: FETCH_MORE_SEARCH_ARTICLES_IF_NEEDED,
        domain,
        searchTerm
    }
}

export function requestSearchArticles() {
    return {
        type: REQUEST_SEARCH_ARTICLES,
    }
}

export function receiveSearchArticles(response) {
    return {
        type: RECEIVE_SEARCH_ARTICLES,
        response,
        receivedAt: Date.now()
    }
}

export function fetchSearchArticlesFailure(error) {
    return {
        type: FETCH_SEARCH_ARTICLES_FAILURE,
        error,
        recievedAt: Date.now()
    }
}

// SAVED ARTICLES

export function saveArticle(article, schoolId) {
    return { type: SAVE_ARTICLE, article, school: schoolId }
}

export function removeSavedArticle(articleId, schoolId) {
    return { type: REMOVE_SAVED_ARTICLE, articleId, school: schoolId }
}

export function initializeSaved(schoolId) {
    return { type: INITIALIZE_SAVED, school: schoolId }
}