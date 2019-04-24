import {combineReducers} from 'redux'
import * as reducers from './reducers';


const appReducer = combineReducers(reducers)

// if user chnges domain clear out domain specific state data
const rootReducer = (state, action) => {
    if (action.type === 'CHANGE_ACTIVE_DOMAIN') {
      state = {
          ...state,
          articlesByCategory: undefined,
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