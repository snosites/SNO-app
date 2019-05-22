import {
    SET_ERROR,
    CLEAR_ERROR
} from '../actionCreators/misc'

export function errors(state = {}, action) {
    switch (action.type) {
        case SET_ERROR:
            return {
                error: action.payload
            }
        case CLEAR_ERROR:
            return {}
        default:
            return state
    }
}