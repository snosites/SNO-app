import {combineReducers} from 'redux'

import * as articles from './articlesReducer';
import * as activeDomain from './activeDomainReducer';
import * as domains from './domainsReducer';
import * as errors from './errorsReducer';
import * as initialization from './initializationReducer';
import * as menus from './menusReducer';
import * as profiles from './profilesReducer';
import * as recentArticles from './recentArticlesReducer';


const appReducer = combineReducers(reducers)

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