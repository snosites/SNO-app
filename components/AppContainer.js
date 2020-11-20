import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { View, ActivityIndicator, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import * as RootNavigation from '../utils/RootNavigation'

import { connect } from 'react-redux'
import { types as globalTypes, actions as globalActions } from '../redux/global'

import { Provider as PaperProvider } from 'react-native-paper'

import ErrorBoundary from '../screens/ErrorBoundary'

import AuthStack from '../navigation/AuthStack'
import MainStackContainer from '../containers/navigators/MainStackContainer'
import SnackbarQueue from './SnackbarQueue'
import NotificationAlertContainer from '../containers/NotificationAlertContainer'

import * as SplashScreen from 'expo-splash-screen'

import * as Linking from 'expo-linking'
import { SafeAreaView } from 'react-native-safe-area-context'

// const prefix = Linking.makeUrl('/')

const Stack = createStackNavigator()

async function hideSplashScreen() {
    await SplashScreen.hideAsync()
}

const AppContainer = (props) => {
    const {
        theme,
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
        <NavigationContainer
            theme={theme.navigationTheme}
            ref={RootNavigation.navigationRef}
            onReady={() => {
                RootNavigation.isReadyRef.current = true
            }}
        >
            <PaperProvider theme={theme}>
                <ErrorBoundary navigation={RootNavigation}>
                    <StatusBar barStyle={theme.primaryIsDark ? 'light-content' : 'dark-content'} />
                    {!activeDomain.id ? <AuthStack /> : <MainStackContainer />}
                </ErrorBoundary>
                <SnackbarQueue />
            </PaperProvider>
        </NavigationContainer>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
    setFromDeepLink: (payload) => dispatch(globalActions.setFromDeepLink(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
