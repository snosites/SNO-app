import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import AppContainerContainer from './containers/AppContainerContainer'

import { AppLoading } from 'expo'
import * as Notifications from 'expo-notifications'
import * as Icon from '@expo/vector-icons'
import * as Font from 'expo-font'
import { Asset } from 'expo-asset'
import * as SplashScreen from 'expo-splash-screen'
import SnackbarQueue from './components/SnackbarQueue'

import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from './redux/configureStore'

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
                require('./assets/images/cns-splash.png'),
            ]),
            Font.loadAsync({
                ...Icon.Ionicons.font,
                openSans: require('./assets/fonts/OpenSans-Regular.ttf'),
                openSansLight: require('./assets/fonts/OpenSans-Light.ttf'),
                openSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
                openSansExtraBold: require('./assets/fonts/OpenSans-ExtraBold.ttf'),
                openSansItalic: require('./assets/fonts/OpenSans-Italic.ttf'),
            }),
        ])
    }

    _handleLoadingError = (error) => {
        console.warn('there was an error loading assets', error)
        Sentry.captureException(error)
        setIsLoadingComplete(true)
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
                    <SafeAreaProvider>
                        <AppContainerContainer />
                    </SafeAreaProvider>
                </PersistGate>
            </ReduxProvider>
        )
    }
}
