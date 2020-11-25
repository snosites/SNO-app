import React, { useEffect, useState, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { View, ActivityIndicator, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import * as Notifications from 'expo-notifications'
import * as RootNavigation from '../utils/RootNavigation'

import { Provider as PaperProvider } from 'react-native-paper'

import ErrorBoundary from '../screens/ErrorBoundary'

import AuthStack from '../navigation/AuthStack'
import MainStackContainer from '../containers/navigators/MainStackContainer'
import SnackbarQueue from './SnackbarQueue'

// import NotificationAlertContainer from '../containers/NotificationAlertContainer'

import * as SplashScreen from 'expo-splash-screen'

import * as Linking from 'expo-linking'
// import Branch, { BranchEvent } from 'expo-branch'

import { SafeAreaView } from 'react-native-safe-area-context'

const prefix = Linking.makeUrl('/')
console.log('prefix', prefix)

async function hideSplashScreen() {
    await SplashScreen.hideAsync()
}

const AppContainer = (props) => {
    const {
        activeDomain,
        theme,
        user,
        initialized,
        initializeUser,
        initializeUserLoading,
        initializeUserError,
        setInitialized,
        initializeDeepLinkUser,
        setDeepLinkArticle,
        fromDeepLink,
        setFromDeepLink,
    } = props

    const notificationListener = useRef().current
    const responseListener = useRef().current

    useEffect(() => {
        if (!user.id) {
            initializeUser()
        }
        if (user.push_token) {
            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener = Notifications.addNotificationReceivedListener((notification) => {
                console.log('notification received...', notification)
                // setNotification(notification)
            })

            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
                console.log('notification response recieved...', response)
            })

            return () => {
                Notifications.removeNotificationSubscription(notificationListener)
                Notifications.removeNotificationSubscription(responseListener)
            }
        }
    }, [user])

    useEffect(() => {
        if (!activeDomain.id) {
            if (initialized) setInitialized(false)
            hideSplashScreen()
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
    const linking = {
        //   prefixes: ['myapp://', 'https://myapp.com'],
        prefixes: [prefix],

        async getInitialURL() {
            const url = await Linking.getInitialURL()

            if (url != null) {
                console.log('found default initial URL', url)
                return url
            } else return null
            // const params = Branch.getFirstReferringParams()

            // return params?.$canonical_url
        },

        subscribe(listener) {
            const onReceiveURL = ({ url }) => {
                console.log('onReceiveURL', url)
                return listener(url)
            }
            Linking.addEventListener('url', onReceiveURL)
            // Branch.subscribe(({ error, params, uri }) => {
            //     if (error) {
            //         console.error('Error from Branch: ' + error)
            //         return
            //     }

            //     if (params['+non_branch_link']) {
            //         const nonBranchUrl = params['+non_branch_link']
            //         // Route non-Branch URL if appropriate.
            //         return
            //     }

            //     if (!params['+clicked_branch_link']) {
            //         // Indicates initialization success and some other conditions.
            //         // No link was opened.
            //         return
            //     }

            //     // A Branch link was opened
            //     const url = params.$canonical_url

            //     listener(url)
            // })

            return () => {
                // Clean up the event listeners
                Linking.removeEventListener('url', onReceiveURL)
                // Branch.unsubscribe()
            }
        },

        // test domain ID 182442528
        // xcrun simctl openurl booted exp://127.0.0.1:19000/--/article/1196
        // xcrun simctl openurl booted exp://127.0.0.1:19000/--/auth/182442528
        config: {
            initialRouteName: activeDomain.id ? 'Tabs' : 'Welcome',
            screens: {
                Welcome: 'Welcome',
                Select: {
                    path: 'auth/:schoolId',
                    parse: {
                        schoolId: Number,
                    },
                },
                Tabs: {
                    initialRouteName: 'HomeTab',
                    screens: {
                        HomeTab: 'homeTab',
                    },
                },
                ArticleNavigator: {
                    path: 'article/:articleId',
                    parse: {
                        articleId: Number,
                    },
                },
            },
        },
    }

    if (!user.id || initializeUserLoading) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator style={{ padding: 100 }} />
            </View>
        )
    }
    return (
        <NavigationContainer
            linking={linking}
            theme={theme.navigationTheme}
            ref={RootNavigation.navigationRef}
            onReady={() => {
                RootNavigation.isReadyRef.current = true
            }}
        >
            <PaperProvider theme={theme}>
                <ErrorBoundary navigation={RootNavigation}>
                    <StatusBar style={theme.primaryIsDark ? 'light' : 'dark'} />
                    {!activeDomain.id ? <AuthStack /> : <MainStackContainer />}
                </ErrorBoundary>
                <SnackbarQueue />
            </PaperProvider>
        </NavigationContainer>
    )
}

export default AppContainer
