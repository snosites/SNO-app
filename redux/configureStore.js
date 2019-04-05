import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleWare from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleWare();

const middlewareList = __DEV__ ? [sagaMiddleware, logger] : [sagaMiddleware]

// used to persist redux state to async storage
const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)



export default () => {
    let store = createStore(persistedReducer, applyMiddleware(...middlewareList))
    let persistor = persistStore(store)
    return { store, persistor }
}

export const store = createStore(
    rootReducer,
    applyMiddleware(...middlewareList)
)

sagaMiddleware.run(rootSaga);