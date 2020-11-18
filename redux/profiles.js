export const types = {
    FETCH_PROFILES: 'FETCH_PROFILES',
    REQUEST_PROFILES: 'REQUEST_PROFILES',
    RECEIVE_PROFILES: 'RECEIVE_PROFILES',
    FETCH_PROFILE: 'FETCH_PROFILE',
    FETCH_PROFILE_REQUEST: 'FETCH_PROFILE_REQUEST',
    FETCH_PROFILE_SUCCESS: 'FETCH_PROFILE_SUCCESS',
    FETCH_PROFILE_ERROR: 'FETCH_PROFILE_ERROR',
    FETCH_PROFILE_ARTICLES: 'FETCH_PROFILE_ARTICLES',
    SET_PROFILE_ARTICLES: 'SET_PROFILE_ARTICLES',
    CLEAR_PROFILE_ARTICLES: 'CLEAR_PROFILE_ARTICLES',
    CLEAR_PROFILE_ERROR: 'CLEAR_PROFILE_ERROR',
    SET_PROFILE_ARTICLE_ERROR: 'SET_PROFILE_ARTICLE_ERROR',
}

export default function profiles(
    state = {
        isLoaded: false,
        items: [],
        single: null,
        articles: [],
        error: '',
    },
    action
) {
    switch (action.type) {
        case types.REQUEST_PROFILES:
            return {
                ...state,
                isLoaded: false,
            }
        case types.RECEIVE_PROFILES:
            return {
                ...state,
                isLoaded: true,
                items: action.profiles,
            }
        case types.FETCH_PROFILE_SUCCESS:
            return {
                ...state,
                single: action.profile,
            }
        case types.FETCH_PROFILE_ERROR:
            return {
                ...state,
                single: null,
            }
        case types.SET_PROFILE_ARTICLES:
            return {
                ...state,
                articles: action.payload,
            }
        case types.CLEAR_PROFILE_ARTICLES:
            return {
                ...state,
                articles: [],
            }
        case types.SET_PROFILE_ARTICLE_ERROR:
            return {
                ...state,
                error: action.payload,
            }
        case types.CLEAR_PROFILE_ERROR:
            return {
                ...state,
                error: '',
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
            year,
        }
    },
    requestProfiles() {
        return {
            type: types.REQUEST_PROFILES,
        }
    },
    receiveProfiles(profiles) {
        return {
            type: types.RECEIVE_PROFILES,
            profiles,
        }
    },
    fetchProfile(profileId) {
        return {
            type: types.FETCH_PROFILE,
            profileId,
        }
    },
    fetchProfileRequest() {
        return {
            type: types.FETCH_PROFILE_REQUEST,
        }
    },
    fetchProfileSuccess(profile) {
        return {
            type: types.FETCH_PROFILE_SUCCESS,
            profile,
        }
    },
    fetchProfileError(error) {
        return {
            type: types.FETCH_PROFILE_ERROR,
            error,
        }
    },
    fetchProfileArticles(url, writerTermId) {
        return {
            type: types.FETCH_PROFILE_ARTICLES,
            url,
            writerTermId,
        }
    },
    setProfileArticles(payload) {
        return {
            type: types.SET_PROFILE_ARTICLES,
            payload,
        }
    },
    clearProfileArticles() {
        return {
            type: types.CLEAR_PROFILE_ARTICLES,
        }
    },
    setProfileArticleError(payload) {
        return {
            type: types.SET_PROFILE_ARTICLE_ERROR,
            payload,
        }
    },
    clearProfileError() {
        return {
            type: types.CLEAR_PROFILE_ERROR,
        }
    },
}
