import { createStore, applyMiddleware } from 'redux'
import { createMigrate, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createSagaMiddleWare from 'redux-saga'
import logger from 'redux-logger'

import rootReducer from './rootReducer'
import themeReducer from './theme'
import rootSaga from '../sagas/rootSaga'

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import { setupSentry } from '../sentry-utils'
import createSentryMiddleware from 'redux-sentry-middleware'
import * as Sentry from 'sentry-expo'

import * as Amplitude from 'expo-analytics-amplitude'
import { getAmplitudeKey } from '../constants/config'

const amplitudeKey = getAmplitudeKey()

// set based on app version
Amplitude.initialize(amplitudeKey)

setupSentry()

const sagaMiddleware = createSagaMiddleWare()

const sentryMiddleware = createSentryMiddleware(Sentry, {
    // Optionally pass some options here.
})

const middlewareList = __DEV__
    ? [sentryMiddleware, sagaMiddleware, logger]
    : [sentryMiddleware, sagaMiddleware]

const migrations = {
    //transform old state to new structure
    7: (prevState) => {
        let newDomains = []
        if (prevState.domains) {
            newDomains = prevState.domains.map((domain) => {
                const newDomain = {
                    active: domain.active ? true : false,
                    id: domain.id,
                    name: domain.name,
                    publication: domain.publication,
                    notificationCategories: [],
                    url: domain.url,
                }
                return newDomain
            })
        }
        const filteredDomains = newDomains.filter((newDomain) => {
            if (newDomain.id) {
                return true
            } else {
                return false
            }
        })

        let newUserObj = undefined
        if (prevState.userInfo) {
            newUserObj = {
                username: prevState.userInfo.username ? prevState.userInfo.username : '',
                email: prevState.userInfo.email ? prevState.userInfo.email : '',
                subscribeAll: false,
                user: {},
                writerSubscriptions: [],
                fromPush: false,
            }
        }
        let updatedSavedArticlesBySchool = {}
        if (prevState.savedArticlesBySchool) {
            updatedSavedArticlesBySchool = prevState.savedArticlesBySchool
        }
        return {
            domains: filteredDomains,
            savedArticlesBySchool: updatedSavedArticlesBySchool,
            user: newUserObj,
        }
    },
}

// used to persist redux state to async storage
const persistConfig = {
    key: 'primary',
    version: 7,
    storage,
    migrate: createMigrate(migrations, { debug: true }),
    whitelist: ['domains', 'user', 'savedArticlesBySchool', 'likedArticlesBySchool'],
    debug: true,
    timeout: 10000,
    stateReconciler: autoMergeLevel2,
}

// const themePersistConfig = {
//     key: 'theme',
//     version: 7,
//     storage,
//     whitelist: ['dark'],
//     debug: true,
//     timeout: 10000,
//     stateReconciler: autoMergeLevel2,
// }

// const newRootReducer = combineReducers({
//     auth: persistReducer(authPersistConfig, authReducer),
//     other: otherReducer,
// })

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, {}, applyMiddleware(...middlewareList))

export const persistor = persistStore(store)
// persistor.purge()
sagaMiddleware.run(rootSaga)
