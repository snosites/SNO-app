import {combineReducers} from 'redux'

import { activeDomain } from './activeDomainReducer';
import { entities, articlesByCategory } from './articlesReducer';
import { domains } from './domainsReducer';
import { errors } from './errorsReducer';
import { availableDomains } from './initializationReducer';
import { menus } from './menusReducer';
import { profiles } from './profilesReducer';
import { recentArticles } from './recentArticlesReducer';
import { savedArticlesBySchool } from './savedArticlesReducer';
import { searchArticles } from './searchReducer';
import { theme } from './themeReducer';
import { userInfo } from './userInfoReducer';


const appReducer = combineReducers({
    activeDomain,
    entities,
    articlesByCategory,
    domains,
    errors,
    availableDomains,
    menus,
    profiles,
    recentArticles,
    savedArticlesBySchool,
    searchArticles,
    theme,
    userInfo
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
    if(action.type === 'PURGE_STATE') {
        state = undefined
    }
  
    return appReducer(state, action)
  }

export default rootReducer