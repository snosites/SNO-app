import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleWare from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';

import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { setupSentry } from '../sentry-utils';
import createRavenMiddleware from "raven-for-redux";
import Sentry from 'sentry-expo';

// sentry setup
Sentry.enableInExpoDevelopment = true;

setupSentry();


const sagaMiddleware = createSagaMiddleWare();

const sentryMiddleware = createRavenMiddleware(Sentry, {
    // options for later
})

const middlewareList = __DEV__ ? [sentryMiddleware, sagaMiddleware, logger] : [, sentryMiddleware, sagaMiddleware]

// used to persist redux state to async storage
const persistConfig = {
    key: 'primary',
    storage,
    whitelist: ['domains', 'savedArticlesBySchool', 'userInfo'],
    debug: true,
    timeout: 10000,
    stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = createStore(persistedReducer, {}, applyMiddleware(...middlewareList));

export const persistor = persistStore(store);
// persistor.purge();
sagaMiddleware.run(rootSaga);