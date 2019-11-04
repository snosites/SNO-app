import { combineReducers } from 'redux'

import user from './user'
import theme from './theme'
import domains from './domains'
import errors from './errors'
import loading from './loading'
import global from './global'

const appReducer = combineReducers({
    user,
    theme,
    domains,
    errors,
    loading,
    global
})

// if user chnges domain clear out domain specific state data
const rootReducer = (state, action) => {
    if (action.type === 'CHANGE_ACTIVE_DOMAIN') {
        state = {
            ...state,
            articlesByCategory: undefined,
            recentArticles: undefined,
            entities: undefined,
            menus: undefined
        }
    }
    if (action.type === 'PURGE_USER_STATE') {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer
