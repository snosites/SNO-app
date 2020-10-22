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
// import NotificationAlert from './NotificationAlert'

import ErrorBoundary from '../screens/ErrorBoundary'

import { Provider as PaperProvider } from 'react-native-paper'
import Color from 'color'

import * as Linking from 'expo-linking'

// const prefix = Linking.makeUrl('/')

const Stack = createStackNavigator()

const AppContainer = (props) => {
    const {
        user,
        initializeUser,
        initializeUserLoading,
        initializeUserError,
        initializeDeepLinkUser,
        activeDomain,
        setDeepLinkArticle,
        fromDeepLink,
        setFromDeepLink,
        theme,
        homeScreenMode,
    } = props

    // let primaryColor = Color(theme.colors.primary)
    // let isDark = primaryColor.isDark()
    // const navigation = useNavigation()

    // const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user.id) {
            initializeUser()
        }
    }, [user])

    useEffect(() => {
        console.log('user', user)
    }, [initializeUserLoading])

    useEffect(() => {
        console.log('activeDomain', activeDomain)
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
            </View>
            {/* <NotificationAlert /> */}
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
