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
import searchAuthors from './searchAuthors'
import profiles from './profiles'
import pages from './pages'
import recentArticles from './recent'
import ads from './ads'
import snackbarQueue from './snackbarQueue'

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
    searchAuthors,
    profiles,
    pages,
    recentArticles,
    ads,
    snackbarQueue,
})

// if user chnges domain clear out domain specific state data
const rootReducer = (state, action) => {
    if (action.type === 'SET_ACTIVE_DOMAIN') {
        state = {
            ...state,
            // FIX LATER MAYBE?? global might cause bug
            global: undefined,
            articlesByCategory: undefined,
            recentArticles: undefined,
            searchArticles: undefined,
            searchAuthors: undefines,
            profiles: undefined,
            pages: undefined,
            entities: undefined,
            ads: undefined,
            errors: {},
            loading: {},
            ads: undefined,
            snackbarQueue: undefined,
        }
    }
    if (action.type === 'PURGE_USER_STATE') {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer
