import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleWare from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';

import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';


const sagaMiddleware = createSagaMiddleWare();

const middlewareList = __DEV__ ? [sagaMiddleware, logger] : [sagaMiddleware]

// used to persist redux state to async storage
const persistConfig = {
    key: 'primary',
    storage,
    whitelist: ['domains', 'savedArticles'],
    debug: true,
    timeout: 10000,
    stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)



export const store = createStore(persistedReducer, {}, applyMiddleware(...middlewareList));

export const persistor = persistStore(store);

// export const nonPersistStore = createStore(
//     rootReducer,
//     applyMiddleware(...middlewareList)
// )

sagaMiddleware.run(rootSaga);