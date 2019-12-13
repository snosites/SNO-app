import { combineReducers } from 'redux'

import user from './user'
import theme from './theme'
import domains from './domains'
import errors from './errors'
import loading from './loading'
import global from './global'
import articlesByCategory, { entities } from './articles'
import savedArticlesBySchool from './savedArticles'
import searchArticles from './search'
import profiles from './profiles'
import recentArticles from './recent'

const appReducer = combineReducers({
    user,
    theme,
    domains,
    errors,
    loading,
    global,
    articlesByCategory,
    entities,
    savedArticlesBySchool,
    searchArticles,
    profiles,
    recentArticles
})


// if user chnges domain clear out domain specific state data
const rootReducer = (state, action) => {
    if (action.type === 'SET_ACTIVE_DOMAIN') {
        state = {
            ...state,
            articlesByCategory: undefined,
            recentArticles: undefined,
            searchArticles: undefined,
            profiles: undefined,
            entities: undefined,
            errors: {},
            loading: {}
        }
    }
    if (action.type === 'PURGE_USER_STATE') {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer
