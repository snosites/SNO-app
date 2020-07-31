export const types = {
    FETCH_ADS: 'FETCH_ADS',
    FETCH_ADS_REQUEST: 'FETCH_ADS_REQUEST',
    FETCH_ADS_SUCCESS: 'FETCH_ADS_SUCCESS',
    FETCH_ADS_ERROR: 'FETCH_ADS_ERROR',
    SEND_AD_ANALYTIC: 'SEND_AD_ANALYTIC',
    SEND_AD_ANALYTIC_REQUEST: 'SEND_AD_ANALYTIC_REQUEST',
    SEND_AD_ANALYTIC_SUCCESS: 'SEND_AD_ANALYTIC_SUCCESS',
    SEND_AD_ANALYTIC_ERROR: 'SEND_AD_ANALYTIC_ERROR',
}

const initialState = {
    displayLocation: null,
    images: [],
}

function ads(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_ADS_SUCCESS:
            return {
                displayLocation: action.payload.display_location,
                images: action.payload.images,
            }
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
    sendAdAnalytic: (url, imageId, field) => ({
        type: types.SEND_AD_ANALYTIC,
        url,
        imageId,
        field,
    }),
    sendAdAnalyticRequest: () => ({ type: types.SEND_AD_ANALYTIC_REQUEST }),
    sendAdAnalyticSuccess: () => ({ type: types.SEND_AD_ANALYTIC_SUCCESS }),
    sendAdAnalyticError: (error) => ({ type: types.SEND_AD_ANALYTIC_ERROR, error }),
}

//selectors
export const getStoryAds = (state) => state.ads.story
export const getListAds = (state) => state.ads.list
export const getHomeAds = (state) => state.ads.home
