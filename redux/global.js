
export const types = {
    FETCH_AVAILABLE_DOMAINS: 'FETCH_AVAILABLE_DOMAINS',
    FETCH_AVAILABLE_DOMAINS_REQUEST: 'FETCH_AVAILABLE_DOMAINS_REQUEST',
    FETCH_AVAILABLE_DOMAINS_SUCCESS: 'FETCH_AVAILABLE_DOMAINS_SUCCESS',
    FETCH_AVAILABLE_DOMAINS_ERROR: 'FETCH_AVAILABLE_DOMAINS_ERROR',
    CLEAR_AVAILABLE_DOMAINS: 'CLEAR_AVAILABLE_DOMAINS'
}

const initialState = {
    availableDomains: []
}

export default function global(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_AVAILABLE_DOMAINS_SUCCESS:
            return {
                ...state,
                availableDomains: action.payload
            }
        case types.CLEAR_AVAILABLE_DOMAINS:
            return {
                ...state,
                availableDomains: []
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
    clearAvailableDomains: () => ({ type: types.CLEAR_AVAILABLE_DOMAINS })
}
