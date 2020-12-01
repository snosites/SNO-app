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
    } = props

    const notificationListener = useRef()
    const responseListener = useRef()

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

    // {
    //     "domain_id": 182442528,
    //     "post_id": 1196,
    //     "site_name": 'SNO Test',
    //     "link": 'https://google.com'
    // }

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

    const handleInitialBranchLink = (schoolId, postId) => {
        alert('handleInitialBranchLink')
        if (schoolId == activeDomain.id) {
            // direct to article
            const url = Linking.makeUrl(`/article/${postId}`)
            return url
        } else {
            // make sure domain origin is a saved domain
            let found = domains.find((domain) => {
                return domain.id == schoolId
            })
            if (!found) {
                // user doesnt have this domain saved so dont direct anywhere
                console.log('no domain saved for this link', schoolId)
                const selectSchoolUrl = Linking.makeUrl(`auth/${schoolId}`)
                return selectSchoolUrl
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
                            setActiveDomain(found.id)
                            setInitialized(false)

                            const url = Linking.makeUrl(`/article/${postId}`)
                            return url
                        },
                    },
                ],
                { cancelable: false }
            )
        }
    }

    const handleBranchLink = (schoolId, postId, listener) => {
        console.log('handleBranchLink')
        if (schoolId == activeDomain.id) {
            // direct to article
            const url = Linking.makeUrl(`/article/${postId}`)
            listener(url)
        } else {
            // make sure domain origin is a saved domain
            let found = domains.find((domain) => {
                return domain.id == schoolId
            })
            if (!found) {
                // user doesnt have this domain saved so dont direct anywhere
                console.log('no domain saved for this link', schoolId)
                const selectSchoolUrl = Linking.makeUrl(`auth/${schoolId}`)
                listener(selectSchoolUrl)
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
                            setActiveDomain(found.id)
                            setInitialized(false)

                            const url = Linking.makeUrl(`/article/${postId}`)
                            listener(url)
                        },
                    },
                ],
                { cancelable: false }
            )
        }
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

                    if (url != null) {
                        console.log('found default initial URL', url)
                        return url
                    }

                    const params = await Branch.getFirstReferringParams()

                    alert('branch initial params', JSON.stringify(params))

                    if (params) {
                        const { school_id, post_id } = params

                        if (school_id && post_id) handleInitialBranchLink(school_id, post_id)
                    }

                    return null
                },

                subscribe(listener) {
                    const onReceiveURL = ({ url }) => {
                        console.log('onReceiveURL', url)
                        return listener(url)
                    }

                    const handleNotificationPress = async (notificationContent) => {
                        const jsonData = notificationContent.data?.body
                        console.log('handleNotificationPress', jsonData)
                        try {
                            if (!jsonData) throw new Error('no JSON data in notification')

                            if (jsonData.link) {
                                await WebBrowser.openBrowserAsync(jsonData.link)
                                return
                            }
                            // if the push is from active domain go to article
                            if (jsonData.domain_id == activeDomain.id) {
                                // get article

                                const url = Linking.makeUrl(`/article/${jsonData.post_id}`)
                                listener(url)
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
                                                setActiveDomain(found.id)
                                                setInitialized(false)

                                                const url = Linking.makeUrl(
                                                    `/article/${jsonData.post_id}`
                                                )
                                                listener(url)
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

                    if (user.push_token) {
                        notificationSubscription = Notifications.addNotificationResponseReceivedListener(
                            ({ notification: { request } }) => {
                                console.log('notification was pressed...', request?.content)
                                handleNotificationPress(request?.content)
                            }
                        )
                    }

                    Linking.addEventListener('url', onReceiveURL)
                    Branch.subscribe(({ error, params, uri }) => {
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
                        const { school_id, post_id } = params
                        handleBranchLink(school_id, post_id, listener)
                    })

                    return () => {
                        // Clean up the event listeners
                        Linking.removeEventListener('url', onReceiveURL)
                        if (notificationSubscription) notificationSubscription.remove()
                        if (Branch.unsubscribe) Branch.unsubscribe()
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
            }}
            theme={theme.navigationTheme}
            ref={RootNavigation.navigationRef}
            onReady={() => {
                RootNavigation.isReadyRef.current = true
            }}
            fallback={<View style={{ backgroundColor: 'red', height: 100 }}></View>}
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
