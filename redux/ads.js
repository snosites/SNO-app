export const types = {
    FETCH_ADS: 'FETCH_ADS',
    FETCH_ADS_REQUEST: 'FETCH_ADS_REQUEST',
    FETCH_ADS_SUCCESS: 'FETCH_ADS_SUCCESS',
    FETCH_ADS_ERROR: 'FETCH_ADS_ERROR',
    SEND_AD_ANALYTIC: 'SEND_AD_ANALYTIC',
    SEND_AD_ANALYTIC_REQUEST: 'SEND_AD_ANALYTIC_REQUEST',
    SEND_AD_ANALYTIC_SUCCESS: 'SEND_AD_ANALYTIC_SUCCESS',
    SEND_AD_ANALYTIC_ERROR: 'SEND_AD_ANALYTIC_ERROR',
    FETCH_SNO_AD_IMAGE: 'FETCH_SNO_AD_IMAGE',
    FETCH_SNO_AD_IMAGE_REQUEST: 'FETCH_SNO_AD_IMAGE_REQUEST',
    FETCH_SNO_AD_IMAGE_SUCCESS: 'FETCH_SNO_AD_IMAGE_SUCCESS',
    FETCH_SNO_AD_IMAGE_ERROR: 'FETCH_SNO_AD_IMAGE_ERROR',
    SEND_SNO_AD_ANALYTIC: 'SEND_SNO_AD_ANALYTIC',
    SEND_SNO_AD_ANALYTIC_REQUEST: 'SEND_SNO_AD_ANALYTIC_REQUEST',
    SEND_SNO_AD_ANALYTIC_SUCCESS: 'SEND_SNO_AD_ANALYTIC_SUCCESS',
    SEND_SNO_AD_ANALYTIC_ERROR: 'SEND_SNO_AD_ANALYTIC_ERROR',
}

const initialState = {
    displayLocation: null,
    images: [],
}

function ads(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_ADS_SUCCESS:
            const obj = {
                displayLocation: action.payload.display_location || 'middle',
                images: action.payload.images || [],
            }
            if (action.payload.images) {
                return obj
            }
            return {
                ...obj,
                snoAds: action.payload,
            }
        case types.FETCH_SNO_AD_IMAGE_SUCCESS:
            return {
                ...state,
                snoAdImage: action.payload,
            }
        case types.FETCH_SNO_AD_IMAGE_ERROR:
            return {
                ...state,
                snoAdImage: null,
            }
        default:
            return state
    }
}

export default function adsByType(state = { list: {}, story: {}, home: {} }, action) {
    switch (action.type) {
        case types.FETCH_ADS_SUCCESS:
        case types.FETCH_SNO_AD_IMAGE_SUCCESS:
        case types.FETCH_SNO_AD_IMAGE_ERROR:
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
    fetchAdsSuccess: (adType, payload) => ({
        type: types.FETCH_ADS_SUCCESS,
        adType,
        payload,
    }),
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
    fetchSnoAdImage: (adSpotId, fallbackUrl) => ({
        type: types.FETCH_SNO_AD_IMAGE,
        adSpotId,
        fallbackUrl,
    }),
    fetchSnoAdImageRequest: () => ({ type: types.FETCH_SNO_AD_IMAGE_REQUEST }),
    fetchSnoAdImageSuccess: (adType, payload) => ({
        type: types.FETCH_SNO_AD_IMAGE_SUCCESS,
        adType,
        payload,
    }),
    fetchSnoAdImageError: (adType) => ({ type: types.FETCH_SNO_AD_IMAGE_ERROR, adType }),
    sendSnoAdAnalytic: (id) => ({ type: types.SEND_SNO_AD_ANALYTIC, id }),
    sendSnoAdAnalyticRequest: () => ({ type: types.SEND_SNO_AD_ANALYTIC_REQUEST }),
    sendSnoAdAnalyticSuccess: () => ({ type: types.SEND_SNO_AD_ANALYTIC_SUCCESS }),
    sendSnoAdAnalyticError: (error) => ({ type: types.SEND_SNO_AD_ANALYTIC_ERROR, error }),
}

//selectors
export const getStoryAds = (state) => state.ads.story || {}
export const getListAds = (state) => state.ads.list || {}
export const getHomeAds = (state) => state.ads.home || {}
