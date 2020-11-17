import React, { useState, useEffect, useRef } from 'react'
import { Text, TouchableOpacity, Alert } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Amplitude from 'expo-analytics-amplitude'

import * as WebBrowser from 'expo-web-browser'

import * as Linking from 'expo-linking'

// import NavigationService from '../utils/NavigationService-old'

import { handleArticlePress } from '../utils/articlePress'
import { asyncFetchArticle } from '../utils/sagaHelpers'
import FadeInView from '../views/FadeInView'

import { Portal } from 'react-native-paper'
import Moment from 'moment'

import * as Sentry from 'sentry-expo'

import { getAmplitudeKey } from '../constants/config'

//set config based on version
const amplitudeKey = getAmplitudeKey()
Amplitude.initialize(amplitudeKey)

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        console.log('notification', notification)
        return {
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }
    },
    handleSuccess: () => console.log('success'),
})

const NotificationAlert = (props) => {
    const {
        user,
        activeDomain,
        domains,
        setActiveDomain,
        setFromPush,
        initialized,
        deepLinkArticle,
        setDeepLinkArticle,
    } = props

    const [notification, setNotification] = useState({})
    const [deepLink, setDeepLink] = useState({})
    const [visible, setVisible] = useState(false)

    const notificationListener = useRef()
    const responseListener = useRef()

    useEffect(() => {
        if (user.push_token) {
            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(
                (notification) => {
                    console.log('notification received...', notification)
                    // setNotification(notification)
                }
            )

            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log('notification repsonse recieved listener', response)
                }
            )

            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current)
                Notifications.removeNotificationSubscription(responseListener.current)
            }
        }
    }, [user])

    // useEffect(() => {
    //     if (!initialized) return
    //     if (notification.origin === 'received') {
    //         // if app is open show custom notification
    //         setVisible(true)
    //         setTimeout(() => {
    //             setVisible(false)
    //         }, 7000)
    //     } else if (notification.origin === 'selected') {
    //         handleNotificationPress()
    //     }
    // }, [notification, initialized])

    // useEffect(() => {
    //     Linking.addEventListener('url', handleDeepLink)
    //     return () => {
    //         Linking.removeEventListener('url', () => {})
    //     }
    // }, [])

    // useEffect(() => {
    //     if (!initialized) return
    //     if (!deepLink.path || !deepLink.params) return
    //     handleDeepLinkNavigation()
    // }, [initialized, deepLink])

    // useEffect(() => {
    //     if (deepLinkArticle.path && deepLinkArticle.params) {
    //         setDeepLink({ path: deepLinkArticle.path, params: deepLinkArticle.params })
    //         setDeepLinkArticle({})
    //     }
    // }, [deepLinkArticle])

    // const handleDeepLink = (e) => {
    //     console.log('handling deep link', e)

    //     const parsedDeepLink = Linking.parse(e.url)

    //     if (parsedDeepLink.path.includes('article')) {
    //         setDeepLink({ path: parsedDeepLink.path, params: parsedDeepLink.queryParams })
    //     }
    // }

    // const handleDeepLinkNavigation = async () => {
    //     console.log('handling deep link nav', deepLinkArticle, deepLink)
    //     if (!deepLink.params) {
    //         return
    //     }
    //     if (deepLink.params.schoolId == activeDomain.id) {
    //         // get article
    //         const article = await asyncFetchArticle(activeDomain.url, deepLink.params.postId)

    //         handleArticlePress(article, activeDomain)
    //     } else {
    //         // make sure domain origin is a saved domain
    //         let found = domains.find((domain) => {
    //             return domain.id == deepLink.params.schoolId
    //         })
    //         if (!found) {
    //             // user doesnt have this domain saved so dont direct anywhere
    //             console.log('directing to deep select', deepLink.params.schoolId)
    //             NavigationService.navigate('DeepSelect', { schoolId: deepLink.params.schoolId })
    //         } else {
    //             Alert.alert(
    //                 'Switch Active School?',
    //                 `Viewing this story will switch your active school to ${found.name}.`,
    //                 [
    //                     {
    //                         text: 'Cancel',
    //                         onPress: () => {},
    //                         style: 'cancel',
    //                     },
    //                     {
    //                         text: 'Proceed',
    //                         onPress: () => {
    //                             _deepLinkSwitchDomain(found, deepLink.params.postId)
    //                         },
    //                     },
    //                 ],
    //                 { cancelable: false }
    //             )
    //         }
    //     }
    //     setDeepLink({})
    // }

    // const handleNotificationPress = async () => {
    //     try {
    //         // send analytics data
    //         Amplitude.logEventWithProperties('notification press', {
    //             domainId: notification.data.domain_id,
    //             storyId: notification.data.post_id,
    //         })

    //         setVisible(false)

    //         if (notification.data.link) {
    //             await WebBrowser.openBrowserAsync(notification.data.link)
    //             return
    //         }
    //         // if the push is from active domain go to article
    //         if (notification.data.domain_id == activeDomain.id) {
    //             // get article
    //             const article = await asyncFetchArticle(activeDomain.url, notification.data.post_id)

    //             handleArticlePress(article, activeDomain)
    //         } else {
    //             // make sure domain origin is a saved domain
    //             let found = domains.find((domain) => {
    //                 return domain.id == notification.data.domain_id
    //             })
    //             if (!found) {
    //                 // user doesnt have this domain saved so dont direct anywhere
    //                 throw new Error('no domain saved for this notification')
    //             }
    //             Alert.alert(
    //                 'Switch Active School?',
    //                 `Viewing this story will switch your active school to ${notification.data.site_name}.`,
    //                 [
    //                     {
    //                         text: 'Cancel',
    //                         onPress: () => {},
    //                         style: 'cancel',
    //                     },
    //                     {
    //                         text: 'Proceed',
    //                         onPress: () => {
    //                             _notificationSwitchDomain(found.url)
    //                         },
    //                     },
    //                 ],
    //                 { cancelable: false }
    //             )
    //         }
    //     } catch (err) {
    //         console.log('error in notification press', err)
    //         Sentry.captureException(err)
    //     }
    // }

    // const _notificationSwitchDomain = async (domainUrl) => {
    //     try {
    //         NavigationService.navigate('AuthLoading', {
    //             switchingDomain: true,
    //         })
    //         // get article
    //         const article = await asyncFetchArticle(domainUrl, notification.data.post_id)

    //         // sets key for app to look for on new domain load
    //         setFromPush(article)
    //         // change active domain
    //         setActiveDomain(Number(notification.data.domain_id))
    //         //navigate to auth loading to load initial domain data
    //         let nav = NavigationService
    //         nav.navigate('AuthLoading', {
    //             switchingDomain: false,
    //         })
    //     } catch (err) {
    //         console.log('error in notification switch domain', err)
    //         NavigationService.navigate('AuthLoading', {
    //             switchingDomain: false,
    //         })
    //         Sentry.captureException(err)
    //     }
    // }

    // const _deepLinkSwitchDomain = async (domain, postId) => {
    //     try {
    //         NavigationService.navigate('AuthLoading', {
    //             switchingDomain: true,
    //         })
    //         // get article
    //         const article = await asyncFetchArticle(domain.url, postId)

    //         // sets key for app to look for on new domain load
    //         setFromPush(article)
    //         // change active domain
    //         setActiveDomain(Number(domain.id))
    //         //navigate to auth loading to load initial domain data
    //         let nav = NavigationService
    //         nav.navigate('AuthLoading', {
    //             switchingDomain: false,
    //         })
    //     } catch (err) {
    //         console.log('error in deeplink switch domain', err)
    //         NavigationService.navigate('AuthLoading', {
    //             switchingDomain: false,
    //         })
    //         Sentry.captureException(err)
    //     }
    // }

    return (
        <FadeInView
            visible={false}
            style={{
                position: 'absolute',
                top: -100,
                right: 10,
                left: 10,
                height: 75,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: '#e0e0e0',
                borderRadius: 7,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,

                elevation: 12,
            }}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                }}
                // onPress={handleNotificationPress}
            >
                <Text style={{ fontSize: 10, paddingLeft: 5, color: '#424242' }}>
                    {String(Moment().fromNow())}
                </Text>
                <Text
                    ellipsizeMode='tail'
                    numberOfLines={1}
                    style={{
                        fontSize: 14,
                        paddingHorizontal: 5,
                    }}
                >
                    {notification.data
                        ? `New ${notification.data.category_name} Story from ${notification.data.site_name}`
                        : null}
                </Text>
                <Text
                    ellipsizeMode='tail'
                    numberOfLines={1}
                    style={{ fontSize: 14, paddingLeft: 5, color: '#757575' }}
                >
                    {notification.data ? notification.data.title : null}
                </Text>
            </TouchableOpacity>
        </FadeInView>
    )
}

export default NotificationAlert
