import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { View, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { connect } from 'react-redux'

import { types as globalTypes, actions as globalActions } from '../redux/global'

import * as RootNavigation from '../utils/RootNavigation'

import AuthStack from '../navigation/AuthStack'
import MainStackContainer from '../containers/MainStackContainer'
import SnackbarQueue from './SnackbarQueue'
// import NotificationAlert from './NotificationAlert'

import * as SplashScreen from 'expo-splash-screen'

import { Provider as PaperProvider } from 'react-native-paper'

import * as Linking from 'expo-linking'

// const prefix = Linking.makeUrl('/')

const Stack = createStackNavigator()

async function hideSplashScreen() {
    await SplashScreen.hideAsync()
}

const AppContainer = (props) => {
    const {
        user,
        initializeUser,
        initializeUserLoading,
        setInitialized,
        initializeUserError,
        initializeDeepLinkUser,
        activeDomain,
        setDeepLinkArticle,
        fromDeepLink,
        setFromDeepLink,
        theme,
        homeScreenMode,
        initialized,
    } = props

    useEffect(() => {
        if (!user.id) {
            initializeUser()
        }
    }, [user])

    useEffect(() => {
        if (!activeDomain.id) {
            hideSplashScreen()
            if (initialized) setInitialized(false)
        }
    }, [activeDomain])

    // useEffect(() => {
    //     if (!initializeUserLoading) setLoading(false)
    // }, [initializeUserLoading])
    // useEffect(() => {
    //     if (switchingDomain) {
    //         return
    //     }
    //     if (fromDeepLink) {
    //         handleFromDeepLink()
    //     } else {
    //         initializeUser()
    //     }
    // }, [switchingDomain, fromDeepLink])

    // const checkIfDeepLinkUser = async () => {
    //     const { path, queryParams } = await Linking.parseInitialURLAsync()

    //     let isDeepSelect = path ? path.includes('deepSelect') : false
    //     let isDeepLinkArticle = path ? path.includes('article') : false

    //     if (path && (isDeepSelect || isDeepLinkArticle)) {
    //         setFromDeepLink(true)
    //     }
    // }

    if (!user.id || initializeUserLoading) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator style={{ padding: 100 }} />
            </View>
        )
    }
    return (
        <PaperProvider theme={theme}>
            <View style={{ flex: 1 }}>
                <StatusBar style={theme.primaryIsDark ? 'light' : 'dark'} />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!activeDomain.id ? (
                        // doesn't have a saved domain
                        <Stack.Screen name='Auth' component={AuthStack} />
                    ) : (
                        // has domain saved
                        <Stack.Screen name='Main' component={MainStackContainer} />
                    )}
                </Stack.Navigator>
                <SnackbarQueue />
                {/* <NotificationAlert /> */}
            </View>
        </PaperProvider>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    homeScreenMode: state.global.homeScreenMode,
})

const mapDispatchToProps = (dispatch) => ({
    setFromDeepLink: (payload) => dispatch(globalActions.setFromDeepLink(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
