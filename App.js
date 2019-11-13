import React, { useState } from 'react'
import {
    ActivityIndicator,
} from 'react-native'
import { AppLoading } from 'expo'
import * as Icon from '@expo/vector-icons'
import * as Font from 'expo-font'
import { Asset } from 'expo-asset'
import { Provider as ReduxProvider } from 'react-redux'

import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from './redux/configureStore'

import AppContainer from './components/AppContainer'

import * as Sentry from 'sentry-expo'


export default App = () => {
    const [isLoadingComplete, setIsLoadingComplete] = useState(false)

    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/anon.png'),
                // highschool assets
                require('./assets/images/the-source-icon.png'),
                require('./assets/images/the-source-logo.png'),
                require('./assets/images/the-source-splash.png'),
                //college assets
                require('./assets/images/cns-icon.png'),
                require('./assets/images/cns-logo.png'),
                require('./assets/images/cns-splash.png')
            ]),
            Font.loadAsync({
                ...Icon.Ionicons.font
            })
        ])
    }

    _handleLoadingError = error => {
        console.warn('there was an error loading assets', error)
        Sentry.captureException(error)
    }

    if (!isLoadingComplete) {
        return (
            <AppLoading
                startAsync={_loadResourcesAsync}
                onError={_handleLoadingError}
                onFinish={() => setIsLoadingComplete(true)}
                autoHideSplash={false}
            />
        )
    } else {
        return (
            <ReduxProvider store={store}>
                <PersistGate
                    loading={<ActivityIndicator style={{ padding: 100 }} />}
                    persistor={persistor}
                >
                    <AppContainer />
                </PersistGate>
            </ReduxProvider>
        )
    }
}

