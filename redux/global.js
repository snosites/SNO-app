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
    RECEIVE_SPORTCENTER_OPTION: 'RECEIVE_SPORTCENTER_OPTION',
    RECEIVE_COMMENTS_OPTION: 'RECEIVE_COMMENTS_OPTION',
    RECEIVE_STORY_LIST_STYLE: 'RECEIVE_STORY_LIST_STYLE',
    RECEIVE_HOME_SCREEN_MODE: 'RECEIVE_HOME_SCREEN_MODE',
    RECEIVE_HOME_SCREEN_CATEGORIES: 'RECEIVE_HOME_SCREEN_CATEGORIES',
    RECEIVE_HOME_SCREEN_LIST_STYLE: 'RECEIVE_HOME_SCREEN_LIST_STYLE',
    FETCH_MENUS: 'FETCH_MENUS',
    FETCH_MENUS_REQUEST: 'FETCH_MENUS_REQUEST',
    FETCH_MENUS_SUCCESS: 'FETCH_MENUS_SUCCESS',
    FETCH_MENUS_ERROR: 'FETCH_MENUS_ERROR',
    ADD_SCHOOL_SUB: 'ADD_SCHOOL_SUB',
    ADD_SCHOOL_SUB_REQUEST: 'ADD_SCHOOL_SUB_REQUEST',
    ADD_SCHOOL_SUB_SUCCESS: 'ADD_SCHOOL_SUB_SUCCESS',
    ADD_SCHOOL_SUB_ERROR: 'ADD_SCHOOL_SUB_ERROR',
    REMOVE_SCHOOL_SUB: 'REMOVE_SCHOOL_SUB',
    REMOVE_SCHOOL_SUB_REQUEST: 'REMOVE_SCHOOL_SUB_REQUEST',
    REMOVE_SCHOOL_SUB_SUCCESS: 'REMOVE_SCHOOL_SUB_SUCCESS',
    REMOVE_SCHOOL_SUB_ERROR: 'REMOVE_SCHOOL_SUB_ERROR',
    ADD_STORY_VIEW: 'ADD_STORY_VIEW',
    ADD_STORY_VIEW_REQUEST: 'ADD_STORY_VIEW_REQUEST',
    ADD_STORY_VIEW_SUCCESS: 'ADD_STORY_VIEW_SUCCESS',
    ADD_STORY_VIEW_ERROR: 'ADD_STORY_VIEW_ERROR',
    FETCH_HOME_SCREEN_ARTICLES: 'FETCH_HOME_SCREEN_ARTICLES',
    FETCH_HOME_SCREEN_ARTICLES_REQUEST: 'FETCH_HOME_SCREEN_ARTICLES_REQUEST',
    FETCH_HOME_SCREEN_ARTICLES_SUCCESS: 'FETCH_HOME_SCREEN_ARTICLES_SUCCESS',
    FETCH_HOME_SCREEN_ARTICLES_ERROR: 'FETCH_HOME_SCREEN_ARTICLES_ERROR',
}

const initialState = {
    availableDomains: [],
    splashScreen: '',
    header: '',
    headerSmall: '',
    menuItems: [],
    sportCenterEnabled: false,
    enableComments: false,
    storyListStyle: 'small',
    homeScreenCategories: [],
    homeScreenListStyle: 'small',
    homeScreenMode: 'categories',
}

export default function global(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_AVAILABLE_DOMAINS_SUCCESS:
        case types.SEARCH_AVAILABLE_DOMAINS_SUCCESS:
            return {
                ...state,
                availableDomains: action.payload,
            }
        case types.CLEAR_AVAILABLE_DOMAINS:
            return {
                ...state,
                availableDomains: [],
            }
        case types.RECEIVE_SPLASH:
            return {
                ...state,
                splashScreen: action.splash,
            }
        case types.RECEIVE_HEADER:
            return {
                ...state,
                header: action.header,
            }
        case types.RECEIVE_HEADER_LOGO:
            return {
                ...state,
                headerSmall: action.headerLogo,
            }
        case types.RECEIVE_SPORTCENTER_OPTION:
            return {
                ...state,
                sportCenterEnabled: action.sportCenter,
            }
        case types.RECEIVE_COMMENTS_OPTION:
            return {
                ...state,
                enableComments: action.comments,
            }
        case types.RECEIVE_STORY_LIST_STYLE:
            return {
                ...state,
                storyListStyle: action.listStyle,
            }
        case types.RECEIVE_HOME_SCREEN_CATEGORIES:
            return {
                ...state,
                homeScreenCategories: action.categories,
            }
        case types.RECEIVE_HOME_SCREEN_MODE:
            return {
                ...state,
                homeScreenMode: action.mode,
            }
        case types.RECEIVE_HOME_SCREEN_LIST_STYLE:
            return {
                ...state,
                homeScreenListStyle: action.listStyle,
            }
        case types.FETCH_MENUS_SUCCESS:
            return {
                ...state,
                menuItems: action.payload,
            }
        case types.FETCH_MENUS_ERROR:
            return {
                ...state,
                menuItems: [],
            }
        default:
            return state
    }
}

export const actions = {
    fetchAvailableDomains: () => ({ type: types.FETCH_AVAILABLE_DOMAINS }),
    fetchAvailableDomainsRequest: () => ({ type: types.FETCH_AVAILABLE_DOMAINS_REQUEST }),
    fetchAvailableDomainsSuccess: (payload) => ({
        type: types.FETCH_AVAILABLE_DOMAINS_SUCCESS,
        payload,
    }),
    fetchAvailableDomainsError: (error) => ({
        type: types.FETCH_AVAILABLE_DOMAINS_ERROR,
        error,
    }),
    searchAvailableDomains: (searchTerm) => ({
        type: types.SEARCH_AVAILABLE_DOMAINS,
        searchTerm,
    }),
    searchAvailableDomainsRequest: () => ({ type: types.SEARCH_AVAILABLE_DOMAINS_REQUEST }),
    searchAvailableDomainsSuccess: (payload) => ({
        type: types.SEARCH_AVAILABLE_DOMAINS_SUCCESS,
        payload,
    }),
    searchAvailableDomainsError: (error) => ({
        type: types.SEARCH_AVAILABLE_DOMAINS_ERROR,
        error,
    }),
    clearAvailableDomains: () => ({ type: types.CLEAR_AVAILABLE_DOMAINS }),
    startup: (domain) => ({ type: types.STARTUP, domain }),
    startupRequest: () => ({ type: types.STARTUP_REQUEST }),
    startupSuccess: () => ({ type: types.STARTUP_SUCCESS }),
    startupError: (error) => ({ type: types.STARTUP_ERROR, error }),
    initializeUser: () => ({ type: types.INITIALIZE_USER }),
    initializeUserRequest: () => ({ type: types.INITIALIZE_USER_REQUEST }),
    initializeUserSuccess: () => ({ type: types.INITIALIZE_USER_SUCCESS }),
    initializeUserError: (error) => ({ type: types.INITIALIZE_USER_ERROR, error }),
    receiveSplash: (splash) => ({ type: types.RECEIVE_SPLASH, splash }),
    receiveHeader: (header) => ({ type: types.RECEIVE_HEADER, header }),
    receiveHeaderLogo: (headerLogo) => ({ type: types.RECEIVE_HEADER_LOGO, headerLogo }),
    receiveSportCenterOption: (sportCenter) => ({
        type: types.RECEIVE_SPORTCENTER_OPTION,
        sportCenter,
    }),
    receiveCommentsOption: (comments) => ({
        type: types.RECEIVE_COMMENTS_OPTION,
        comments,
    }),
    receiveStoryListStyle: (listStyle) => ({
        type: types.RECEIVE_STORY_LIST_STYLE,
        listStyle,
    }),
    receiveHomeScreenCategories: (categories) => ({
        type: types.RECEIVE_HOME_SCREEN_CATEGORIES,
        categories,
    }),
    receiveHomeScreenListStyle: (listStyle) => ({
        type: types.RECEIVE_HOME_SCREEN_LIST_STYLE,
        listStyle,
    }),
    receiveHomeScreenMode: (mode) => ({
        type: types.RECEIVE_HOME_SCREEN_MODE,
        mode,
    }),
    fetchMenus: (domain) => ({ type: types.FETCH_MENUS, domain }),
    fetchMenusRequest: () => ({ type: types.FETCH_MENUS_REQUEST }),
    fetchMenusSuccess: (payload) => ({ type: types.FETCH_MENUS_SUCCESS, payload }),
    fetchMenusError: (error) => ({ type: types.FETCH_MENUS_ERROR, error }),
    addSchoolSub: (url) => ({ type: types.ADD_SCHOOL_SUB, url }),
    addSchoolSubRequest: () => ({ type: types.ADD_SCHOOL_SUB_REQUEST }),
    addSchoolSubSuccess: () => ({ type: types.ADD_SCHOOL_SUB_SUCCESS }),
    addSchoolSubError: (error) => ({ type: types.ADD_SCHOOL_SUB_ERROR, error }),
    removeSchoolSub: (url) => ({ type: types.REMOVE_SCHOOL_SUB, url }),
    removeSchoolSubRequest: () => ({ type: types.REMOVE_SCHOOL_SUB_REQUEST }),
    removeSchoolSubSuccess: () => ({ type: types.REMOVE_SCHOOL_SUB_SUCCESS }),
    removeSchoolSubError: (error) => ({ type: types.REMOVE_SCHOOL_SUB_ERROR, error }),
    addStoryView: (url, postId) => ({ type: types.ADD_STORY_VIEW, url, postId }),
    addStoryViewRequest: () => ({ type: types.ADD_STORY_VIEW_REQUEST }),
    addStoryViewSuccess: () => ({ type: types.ADD_STORY_VIEW_SUCCESS }),
    addStoryViewError: (error) => ({ type: types.ADD_STORY_VIEW_ERROR, error }),
    fetchHomeScreenArticles: () => ({ type: types.FETCH_HOME_SCREEN_ARTICLES }),
    fetchHomeScreenArticlesRequest: () => ({ type: types.FETCH_HOME_SCREEN_ARTICLES_REQUEST }),
    fetchHomeScreenArticlesSuccess: () => ({ type: types.FETCH_HOME_SCREEN_ARTICLES_SUCCESS }),
    fetchHomeScreenArticlesError: (error) => ({
        type: types.FETCH_HOME_SCREEN_ARTICLES_ERROR,
        error,
    }),
}
