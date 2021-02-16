import React, { useEffect, useState, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { View, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import * as Notifications from 'expo-notifications'
import * as RootNavigation from '../utils/RootNavigation'

import { Provider as PaperProvider } from 'react-native-paper'

import ErrorBoundary from '../screens/ErrorBoundary'

import AuthStack from '../navigation/AuthStack'
import MainStackContainer from '../containers/navigators/MainStackContainer'
import SnackbarQueue from './SnackbarQueue'

import * as SplashScreen from 'expo-splash-screen'

import * as Linking from 'expo-linking'
import Branch from '../constants/branchSetup'
import { SafeAreaView } from 'react-native-safe-area-context'

const prefix = Linking.makeUrl('/')

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        return {
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }
    },
})

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
        setActiveDomain,
        firstInstall,
        setFirstInstall,
        domains,
    } = props

    const navigationQueue = useRef(null)

    useEffect(() => {
        return () => {
            RootNavigation.isReadyRef.current = false
        }
    }, [])

    useEffect(() => {
        if (!user.id) {
            initializeUser()
        }
    }, [user])

    useEffect(() => {
        if (!activeDomain.id) {
            if (initialized) setInitialized(false)
            hideSplashScreen()
        }
    }, [activeDomain])

    const errorRetry = () => {
        setActiveDomain()
        setInitialized(false)
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
            linking={{
                prefixes: [prefix],
                async getInitialURL() {
                    const url = await Linking.getInitialURL()
                    const parsedUrl = await Linking.parseInitialURLAsync()

                    if (url != null && parsedUrl?.path) {
                        console.log('found default initial URL', url)
                        return url
                    }

                    const params = await Branch.getFirstReferringParams()

                    const schoolId = params?.school_id
                    const postId = params?.post_id

                    if (firstInstall && schoolId) {
                        setFirstInstall(false)

                        const branchLinkType = params['~feature']

                        if (branchLinkType === 'linked-school') {
                            setActiveDomain(null)
                            setInitialized(false)

                            const selectSchoolUrl = Linking.makeUrl(`auth/${schoolId}`)
                            return selectSchoolUrl
                        } else {
                            // article link
                            const url = Linking.makeUrl(`/article/${postId}`)
                            navigationQueue.current = url
                            setActiveDomain(null)
                            setInitialized(false)

                            const selectSchoolUrl = Linking.makeUrl(`auth/${schoolId}`)
                            return selectSchoolUrl
                        }
                    }

                    return null
                },

                subscribe(listener) {
                    const handleNotificationPress = async (notificationContent) => {
                        const jsonData = notificationContent.data
                        console.log('handleNotificationPress', jsonData)
                        try {
                            if (!jsonData) throw new Error('no JSON data in notification')

                            if (jsonData.link) {
                                await WebBrowser.openBrowserAsync(jsonData.link)
                                return
                            }
                            // if the push is from active domain go to article
                            if (Number(jsonData.domain_id) == activeDomain.id) {
                                // get article

                                const url = Linking.makeUrl(`/article/${jsonData.post_id}`)

                                if (initialized) listener(url)
                                else {
                                    navigationQueue.current = url
                                    return
                                }
                            } else {
                                // make sure domain origin is a saved domain
                                let found = domains.find((domain) => {
                                    return domain.id == jsonData.domain_id
                                })
                                if (!found) {
                                    // user doesnt have this domain saved so dont direct anywhere
                                    throw new Error('no domain saved for this notification')
                                }
                                Alert.alert(
                                    'Switch Active School?',
                                    `Viewing this story will switch your active school to ${jsonData.site_name}.`,
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => {},
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Proceed',
                                            onPress: () => {
                                                const url = Linking.makeUrl(
                                                    `/article/${jsonData.post_id}`
                                                )
                                                navigationQueue.current = url

                                                setActiveDomain(found.id)
                                                setInitialized(false)
                                            },
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            }
                        } catch (err) {
                            console.log('error in notification press', err)
                            Sentry.captureException(err)
                            return null
                        }
                    }

                    let notificationSubscription = null
                    let branchUnsubscribe = null

                    if (user.push_token) {
                        notificationSubscription = Notifications.addNotificationResponseReceivedListener(
                            ({ notification: { request } }) => {
                                console.log('notification was pressed...', request?.content)
                                handleNotificationPress(request?.content)
                            }
                        )
                    }

                    // Linking.addEventListener('url', onReceiveURL)
                    Branch.initSessionTtl = 10000
                    if (RootNavigation.isReadyRef.current && (!activeDomain.id || initialized)) {
                        if (navigationQueue.current && initialized) {
                            const url = navigationQueue.current
                            navigationQueue.current = null
                            //need to handle navigation
                            listener(url)
                        }

                        branchUnsubscribe = Branch.subscribe(({ error, params, uri }) => {
                            if (error) {
                                console.error('Error from Branch: ' + error)
                                return
                            }
                            if (params['+non_branch_link']) {
                                const nonBranchUrl = params['+non_branch_link']
                                // Route non-Branch URL if appropriate.
                                console.log('nonBranchUrl: ' + nonBranchUrl)
                                return
                            }
                            if (!params['+clicked_branch_link']) {
                                // Indicates initialization success and some other conditions.
                                // No link was opened.
                                return
                            }

                            // A Branch link was opened
                            const schoolId = params?.school_id
                            const postId = params?.post_id
                            const linkType = params['~feature']

                            if (linkType === 'linked-school') {
                                setActiveDomain(null)

                                const url = Linking.makeUrl(`auth/${schoolId}`)
                                listener(url)
                                return
                            }
                            if (schoolId && schoolId == activeDomain.id) {
                                // direct to article
                                const url = Linking.makeUrl(`/article/${postId}`)
                                listener(url)
                            } else {
                                // check if linked domain is saved
                                let found = domains.find((domain) => {
                                    return domain.id == schoolId
                                })
                                // user doesnt have this domain saved
                                if (!found) {
                                    // const url = Linking.makeUrl(`/article/${postId}`)
                                    // navigationQueue.current = url
                                    // setActiveDomain(null)
                                    // setInitialized(false)

                                    const selectSchoolUrl = Linking.makeUrl(`auth/${schoolId}`)
                                    listener(selectSchoolUrl)
                                    return
                                } else {
                                    Alert.alert(
                                        'Switch Active School?',
                                        `Viewing this story will switch your active school.`,
                                        [
                                            {
                                                text: 'Cancel',
                                                onPress: () => {},
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Proceed',
                                                onPress: () => {
                                                    const url = Linking.makeUrl(
                                                        `/article/${postId}`
                                                    )
                                                    navigationQueue.current = url
                                                    setActiveDomain(found.id)
                                                    setInitialized(false)
                                                },
                                            },
                                        ],
                                        { cancelable: false }
                                    )
                                }
                            }
                        })
                    }

                    return () => {
                        // Clean up the event listeners
                        // Linking.removeEventListener('url', onReceiveURL)
                        if (notificationSubscription) notificationSubscription.remove()
                        if (branchUnsubscribe) branchUnsubscribe()
                    }
                },
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
            }}
            theme={theme.navigationTheme}
            ref={RootNavigation.navigationRef}
            onReady={() => {
                RootNavigation.isReadyRef.current = true
            }}
            fallback={<View style={{ backgroundColor: 'red', height: 100 }}></View>}
        >
            <PaperProvider theme={theme}>
                <ErrorBoundary onRetry={errorRetry}>
                    <StatusBar style={theme.primaryIsDark ? 'light' : 'dark'} />
                    {!activeDomain.id ? <AuthStack /> : <MainStackContainer />}
                </ErrorBoundary>
                <SnackbarQueue />
            </PaperProvider>
        </NavigationContainer>
    )
}

export default AppContainer
