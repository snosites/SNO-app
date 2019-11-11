export const types = {
    FETCH_PROFILES: 'FETCH_PROFILES',
    REQUEST_PROFILES: 'REQUEST_PROFILES',
    RECEIVE_PROFILES: 'RECEIVE_PROFILES',
    FETCH_PROFILE_ARTICLES: 'FETCH_PROFILE_ARTICLES',
    SET_PROFILE_ARTICLES: 'SET_PROFILE_ARTICLES',
    CLEAR_PROFILE_ARTICLES: 'CLEAR_PROFILE_ARTICLES',
    CLEAR_PROFILE_ERROR: 'CLEAR_PROFILE_ERROR',
    SET_PROFILE_ARTICLE_ERROR: 'SET_PROFILE_ARTICLE_ERROR'
}

export default function profiles(
    state = {
        isLoaded: false,
        items: [],
        articles: [],
        error: ''
    },
    action
) {
    switch (action.type) {
        case types.REQUEST_PROFILES:
            return {
                ...state,
                isLoaded: false
            }
        case types.RECEIVE_PROFILES:
            return {
                ...state,
                isLoaded: true,
                items: action.profiles
            }
        case types.SET_PROFILE_ARTICLES:
            return {
                ...state,
                articles: action.payload
            }
        case types.CLEAR_PROFILE_ARTICLES:
            return {
                ...state,
                articles: []
            }
        case types.SET_PROFILE_ARTICLE_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case types.CLEAR_PROFILE_ERROR:
            return {
                ...state,
                error: ''
            }
        default:
            return state
    }
}

export const actions = {
    fetchProfiles(domain, year) {
        return {
            type: types.FETCH_PROFILES,
            domain,
            year
        }
    },
    requestProfiles() {
        return {
            type: types.REQUEST_PROFILES
        }
    },
    receiveProfiles(profiles) {
        return {
            type: RECEIVE_PROFILES,
            profiles
        }
    },
    fetchProfileArticles(url, writerName) {
        return {
            type: types.FETCH_PROFILE_ARTICLES,
            url,
            writerName
        }
    },
    setProfileArticles(payload) {
        return {
            type: types.SET_PROFILE_ARTICLES,
            payload
        }
    },
    clearProfileArticles() {
        return {
            type: types.CLEAR_PROFILE_ARTICLES
        }
    },
    setProfileArticleError(payload) {
        return {
            type: types.SET_PROFILE_ARTICLE_ERROR,
            payload
        }
    },
    clearProfileError() {
        return {
            type: types.CLEAR_PROFILE_ERROR
        }
    }
}
