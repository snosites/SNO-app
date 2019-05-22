import {
    SET_ACTIVE_DOMAIN
} from '../actionCreators/savedDomains';


export function activeDomain(state = {}, action) {
    switch (action.type) {
        case SET_ACTIVE_DOMAIN:
            return action.domainObj
        default:
            return state
    }
}