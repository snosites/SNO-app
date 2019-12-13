export const types = {
    FETCH_AVAILABLE_DOMAINS: 'FETCH_AVAILABLE_DOMAINS',
    FETCH_AVAILABLE_DOMAINS_REQUEST: 'FETCH_AVAILABLE_DOMAINS_REQUEST',
    FETCH_AVAILABLE_DOMAINS_SUCCESS: 'FETCH_AVAILABLE_DOMAINS_SUCCESS',
    FETCH_AVAILABLE_DOMAINS_ERROR: 'FETCH_AVAILABLE_DOMAINS_ERROR',
    SEARCH_AVAILABLE_DOMAINS: 'SEARCH_AVAILABLE_DOMAINS',
    SEARCH_AVAILABLE_DOMAINS_REQUEST: 'SEARCH_AVAILABLE_DOMAINS_REQUEST',
    SEARCH_AVAILABLE_DOMAINS_SUCCESS: 'SEARCH_AVAILABLE_DOMAINS_SUCCESS',
    SEARCH_AVAILABLE_DOMAINS_ERROR: 'SEARCH_AVAILABLE_DOMAINS_ERROR',
    CLEAR_AVAILABLE_DOMAINS: 'CLEAR_AVAILABLE_DOMAINS',
    STARTUP: 'STARTUP',
    STARTUP_REQUEST: 'STARTUP_REQUEST',
    STARTUP_SUCCESS: 'STARTUP_SUCCESS',
    STARTUP_ERROR: 'STARTUP_ERROR',
    INITIALIZE_USER: 'INITIALIZE_USER',
    INITIALIZE_USER_REQUEST: 'INITIALIZE_USER_REQUEST',
    INITIALIZE_USER_SUCCESS: 'INITIALIZE_USER_SUCCESS',
    INITIALIZE_USER_ERROR: 'INITIALIZE_USER_ERROR',
    RECEIVE_SPLASH: 'RECEIVE_SPLASH',
    RECEIVE_HEADER: 'RECEIVE_HEADER',
    RECEIVE_HEADER_LOGO: 'RECEIVE_HEADER_LOGO',
    FETCH_MENUS: 'FETCH_MENUS',
    FETCH_MENUS_REQUEST: 'FETCH_MENUS_REQUEST',
    FETCH_MENUS_SUCCESS: 'FETCH_MENUS_SUCCESS',
    FETCH_MENUS_ERROR: 'FETCH_MENUS_ERROR'
}

const initialState = {
    availableDomains: [],
    splashScreen: '',
    header: '',
    headerSmall: '',
    menuItems: []
}

export default function global(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_AVAILABLE_DOMAINS_SUCCESS:
        case types.SEARCH_AVAILABLE_DOMAINS_SUCCESS:
            return {
                ...state,
                availableDomains: action.payload
            }
        case types.CLEAR_AVAILABLE_DOMAINS:
            return {
                ...state,
                availableDomains: []
            }
        case types.RECEIVE_SPLASH:
            return {
                ...state,
                splashScreen: action.splash
            }
        case types.RECEIVE_HEADER:
            return {
                ...state,
                header: action.header
            }
        case types.RECEIVE_HEADER_LOGO:
            return {
                ...state,
                headerSmall: action.headerLogo
            }
        case types.FETCH_MENUS_SUCCESS:
            return {
                ...state,
                menuItems: action.payload
            }
        case types.FETCH_MENUS_ERROR:
            return {
                ...state,
                menuItems: []
            }
        default:
            return state
    }
}

export const actions = {
    fetchAvailableDomains: () => ({ type: types.FETCH_AVAILABLE_DOMAINS }),
    fetchAvailableDomainsRequest: () => ({ type: types.FETCH_AVAILABLE_DOMAINS_REQUEST }),
    fetchAvailableDomainsSuccess: payload => ({
        type: types.FETCH_AVAILABLE_DOMAINS_SUCCESS,
        payload
    }),
    fetchAvailableDomainsError: error => ({
        type: types.FETCH_AVAILABLE_DOMAINS_ERROR,
        error
    }),
    searchAvailableDomains: searchTerm => ({ type: types.SEARCH_AVAILABLE_DOMAINS, searchTerm }),
    searchAvailableDomainsRequest: () => ({ type: types.SEARCH_AVAILABLE_DOMAINS_REQUEST }),
    searchAvailableDomainsSuccess: payload => ({
        type: types.SEARCH_AVAILABLE_DOMAINS_SUCCESS,
        payload
    }),
    searchAvailableDomainsError: error => ({ type: types.SEARCH_AVAILABLE_DOMAINS_ERROR, error }),
    clearAvailableDomains: () => ({ type: types.CLEAR_AVAILABLE_DOMAINS }),
    startup: domain => ({ type: types.STARTUP, domain }),
    startupRequest: () => ({ type: types.STARTUP_REQUEST }),
    startupSuccess: () => ({ type: types.STARTUP_SUCCESS }),
    startupError: error => ({ type: types.STARTUP_ERROR, error }),
    initializeUser: () => ({ type: types.INITIALIZE_USER }),
    initializeUserRequest: () => ({ type: types.INITIALIZE_USER_REQUEST }),
    initializeUserSuccess: () => ({ type: types.INITIALIZE_USER_SUCCESS }),
    initializeUserError: error => ({ type: types.INITIALIZE_USER_ERROR, error }),
    receiveSplash: splash => ({ type: types.RECEIVE_SPLASH, splash }),
    receiveHeader: header => ({ type: types.RECEIVE_HEADER, header }),
    receiveHeaderLogo: headerLogo => ({ type: types.RECEIVE_HEADER_LOGO, headerLogo }),
    fetchMenus: domain => ({ type: types.FETCH_MENUS, domain }),
    fetchMenusRequest: () => ({ type: types.FETCH_MENUS_REQUEST }),
    fetchMenusSuccess: payload => ({ type: types.FETCH_MENUS_SUCCESS, payload }),
    fetchMenusError: error => ({ type: types.FETCH_MENUS_ERROR, error })
}
