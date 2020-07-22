export const types = {
    FETCH_ADS: 'FETCH_ADS',
    FETCH_ADS_REQUEST: 'FETCH_ADS_REQUEST',
    FETCH_ADS_SUCCESS: 'FETCH_ADS_SUCCESS',
    FETCH_ADS_ERROR: 'FETCH_ADS_ERROR',
}

const initialState = {}

function ads(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_ADS_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export default function adsByType(state = {}, action) {
    switch (action.type) {
        case types.FETCH_ADS_SUCCESS:
            return {
                ...state,
                [action.adType]: ads(state[action.adType], action),
            }
        default:
            return state
    }
}

export const actions = {
    fetchAds: (adType) => ({ type: types.FETCH_ADS, adType }),
    fetchAdsRequest: () => ({ type: types.FETCH_ADS_REQUEST }),
    fetchAdsSuccess: (adType, payload) => ({ type: types.FETCH_ADS_SUCCESS, adType, payload }),
    fetchAdsError: (adType, error) => ({ type: types.FETCH_ADS_ERROR, adType, error }),
}

//selectors
