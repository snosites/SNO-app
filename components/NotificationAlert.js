import React, { useState, useEffect } from 'react'
import {
    Text,
    TouchableOpacity,
    Alert
} from 'react-native'
import { Notifications } from 'expo'
import * as Amplitude from 'expo-analytics-amplitude'
import Constants from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import { connect } from 'react-redux'
import { changeActiveDomain, setFromPush } from '../redux/actionCreators'

import NavigationService from '../utils/NavigationService'

import { handleArticlePress } from '../utils/articlePress'
import { asyncFetchFeaturedImage, asyncFetchComments } from '../utils/sagaHelpers'
import FadeInView from '../views/FadeInView'

import { Portal } from 'react-native-paper'
import Moment from 'moment'

import * as Sentry from 'sentry-expo'

//set config based on version
let amplitudeKey = ''
if (Constants.manifest.releaseChannel === 'sns') {
    amplitudeKey = Constants.manifest.extra.highSchool.amplitudeKey
} else {
    amplitudeKey = Constants.manifest.extra.college.amplitudeKey
}
Amplitude.initialize(amplitudeKey)

const NotificationAlert = props => {
    const [notification, setNotification] = useState({})
    const [visible, setVisible] = useState(false)

    const { userInfo, activeDomain, domains, dispatch } = props

    useEffect(() => {
        if (userInfo.tokenId) {
            const notificationSubscription = Notifications.addListener(notification =>
                setNotification(notification)
            )
            return () => notificationSubscription.remove()
        }
    }, [userInfo])

    useEffect(() => {
        // if app is open show custom notification
        if (notification.origin === 'received') {
            setVisible(true)
            setTimeout(() => {
                setVisible(false)
            }, 7000)
        } else if (notification.origin === 'selected') {
            handleNotificationPress()
        }
    }, [notification])

    const handleNotificationPress = async () => {
        try {
            // send analytics data
            Amplitude.logEventWithProperties('notification press', {
                domainId: notification.data.domain_id,
                storyId: notification.data.post_id
            })

            setVisible(false)

            if (notification.data.link) {
                await WebBrowser.openBrowserAsync(notification.data.link)
                return
            }
            // if the push is from active domain go to article
            if (notification.data.domain_id == activeDomain.id) {
                // get article
                const article = await _fetchArticle(
                    activeDomain.url,
                    notification.data.post_id
                )
                // get featured image if there is one
                if (article._links['wp:featuredmedia']) {
                    await asyncFetchFeaturedImage(
                        `${article._links['wp:featuredmedia'][0].href}`,
                        article
                    )
                }
                // get comments
                await asyncFetchComments(activeDomain.url, article)
                handleArticlePress(article, activeDomain)
            } else {
                // make sure domain origin is a saved domain
                let found = domains.find(domain => {
                    return domain.id == notification.data.domain_id
                })
                if (!found) {
                    // user doesnt have this domain saved so dont direct anywhere -- if this happens it would be a bug
                    return
                }
                Alert.alert(
                    'Switch Active School?',
                    `Viewing this story will switch your active school to ${notification.data.site_name}.`,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => {},
                            style: 'cancel'
                        },
                        {
                            text: 'Proceed',
                            onPress: () => {
                                _notificationSwitchDomain(found.url)
                            }
                        }
                    ],
                    { cancelable: false }
                )
            }
        } catch (err) {
            console.log('error in notification press', err)
            Sentry.captureException(err)
        }
    }

    _notificationSwitchDomain = async url => {
        try {
            NavigationService.navigate('AuthLoading', {
                switchingDomain: true
            })
            // get article
            const article = await _fetchArticle(url, notification.data.post_id)
            // get featured image if there is one
            if (article._links['wp:featuredmedia']) {
                await asyncFetchFeaturedImage(
                    `${article._links['wp:featuredmedia'][0].href}`,
                    article
                )
            }
            // get comments
            await asyncFetchComments(url, article)
            // sets key for app to look for on new domain load
            dispatch(setFromPush(article))
            // change active domain
            dispatch(changeActiveDomain(Number(notification.data.domain_id)))
            //navigate to auth loading to load initial domain data
            let nav = NavigationService
            nav.navigate('AuthLoading', {
                switchingDomain: false
            })
        } catch (err) {
            console.log('error in notification switch domain', err)
            NavigationService.navigate('HomeStack')
            Sentry.captureException(err)
        }
    }

    return (
        <Portal>
            <FadeInView
                visible={visible}
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
                        height: 6
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,

                    elevation: 12
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'space-between'
                    }}
                    onPress={handleNotificationPress}
                >
                    <Text style={{ fontSize: 10, paddingLeft: 5, color: '#424242' }}>
                        {String(Moment().fromNow())}
                    </Text>
                    <Text
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        style={{
                            fontSize: 14,
                            paddingHorizontal: 5
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
        </Portal>
    )
}

_fetchArticle = async (url, articleId) => {
    try {
        const result = await fetch(`https://${url}/wp-json/wp/v2/posts/${articleId}`)
        const article = await result.json()
        if (result.status != 200) {
            throw new Error('error getting article from push')
        }
        return article
    } catch (err) {
        console.log('error fetching article', err)
        throw err
    }
}



const mapStateToProps = store => ({
    userInfo: store.userInfo,
    activeDomain: store.activeDomain,
    domains: store.domains
})

export default connect(mapStateToProps)(NotificationAlert)
