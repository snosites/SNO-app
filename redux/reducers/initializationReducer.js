import {
    SET_AVAILABLE_DOMAINS,
    CLEAR_AVAILABLE_DOMAINS
} from '../actionCreators/initialization'


export function availableDomains(state = [], action) {
    switch (action.type) {
        case SET_AVAILABLE_DOMAINS:
            if (action.domains.length == 0) {
                return ['none']
            }
            return action.domains
        case CLEAR_AVAILABLE_DOMAINS:
            return []
        default:
            return state
    }
}