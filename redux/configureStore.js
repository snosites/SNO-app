import { createStore, applyMiddleware } from 'redux';
import { createMigrate, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleWare from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from './rootReducer';
import rootSaga from '../sagas/rootSaga';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { setupSentry } from '../sentry-utils';
import createSentryMiddleware from 'redux-sentry-middleware'
import * as Sentry from 'sentry-expo'


setupSentry();

const sagaMiddleware = createSagaMiddleWare();

const sentryMiddleware = createSentryMiddleware(Sentry, {
    // Optionally pass some options here.
})

const middlewareList = __DEV__ ? [sentryMiddleware, sagaMiddleware, logger] : [ sentryMiddleware, sagaMiddleware]

const migrations = {
    //transform old state to new structure
    4: state => {
        console.log('reconciling state...', state)
        let newDomains = []
        if(state.domains) {
            newDomains = state.domains.map(domain => {
                const newDomain = {
                    active: domain.active,
                    id: domain.domain_id,
                    name: domain.name,
                    publication: domain.publication,
                    url: domain.url
                }
                return newDomain
            })
        }
        
        let newUserObj = undefined
        if(state.userInfo){
            newUserObj = {
                username: state.userInfo.username,
                email: state.userInfo.email,
                subscribeAll: false,
                user: {},
                commentPosted: false,
                writerSubscriptions: [],
                fromPush: false
            }
        }
        return {
            domains: newDomains,
            savedArticlesBySchool: state.savedArticlesBySchool,
            user: newUserObj
        }
    }
}

// used to persist redux state to async storage
const persistConfig = {
    key: 'primary',
    version: 4,
    storage,
    migrate: createMigrate(migrations, { debug: true }),
    whitelist: ['domains', 'savedArticlesBySchool', 'user'],
    debug: true,
    timeout: 10000,
    stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = createStore(persistedReducer, {}, applyMiddleware(...middlewareList));

export const persistor = persistStore(store);
// persistor.purge();
sagaMiddleware.run(rootSaga);