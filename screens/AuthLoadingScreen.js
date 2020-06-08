import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar, View, Text, Image } from 'react-native'
import Constants from 'expo-constants'

import { types as userTypes } from '../redux/user'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { createErrorMessageSelector } from '../redux/errors'

import { actions as domainActions, getActiveDomain } from '../redux/domains'

import { Button } from 'react-native-paper'

import { connect } from 'react-redux'
import { getReleaseChannel } from '../constants/config'

import * as Linking from 'expo-linking'

const version = getReleaseChannel()

const primaryColor =
    version === 'sns'
        ? Constants.manifest.extra.highSchool.primary
        : Constants.manifest.extra.college.primary

const createUserErrorSelector = createErrorMessageSelector([
    userTypes.FIND_OR_CREATE_USER,
    globalTypes.INITIALIZE_USER,
])

const AuthLoadingScreen = (props) => {
    const switchingDomain = props.navigation.getParam('switchingDomain', false)
    const loadedDeepLink = props.navigation.getParam('loadedDeepLink', false)
    const { initializeUser, initializeDeepLinkUser, error, activeDomain } = props

    useEffect(() => {
        if (switchingDomain) {
            return
        }

        checkIfDeepLinkUser()
        // Linking.addEventListener('url', (x) => console.log('x', x))

        // return () => {
        //     Linking.removeEventListener('url', (x) => console.log('x remove', x))
        // }
    }, [switchingDomain])

    const checkIfDeepLinkUser = async () => {
        const { path, queryParams } = await Linking.parseInitialURLAsync()

        let isDeepSelect = path ? path.includes('deepSelect') : false
        let isDeepLinkArticle = path ? path.includes('article') : false

        if (path && isDeepSelect && !loadedDeepLink) {
            initializeDeepLinkUser()
        } else if (path && isDeepLinkArticle) {
            handleDeepLinkArticle(queryParams.schoolId || null)
        } else {
            console.log('in else')
            initializeUser()
        }
    }

    const handleDeepLinkArticle = async (params) => {
        if (params.schoolId == activeDomain.id) {
            // get article
            const article = await asyncFetchArticle(activeDomain.url, notification.data.post_id)
            // handleArticlePress(article, activeDomain)
            // } else {
            //     // make sure domain origin is a saved domain
            //     let found = domains.find((domain) => {
            //         return domain.id == notification.data.domain_id
            //     })
            //     if (!found) {
            //         // user doesnt have this domain saved so dont direct anywhere
            //         throw new Error('no domain saved for this notification')
            //     }
            //     Alert.alert(
            //         'Switch Active School?',
            //         `Viewing this story will switch your active school to ${notification.data.site_name}.`,
            //         [
            //             {
            //                 text: 'Cancel',
            //                 onPress: () => {},
            //                 style: 'cancel',
            //             },
            //             {
            //                 text: 'Proceed',
            //                 onPress: () => {
            //                     _notificationSwitchDomain(found.url)
            //                 },
            //             },
            //         ],
            //         { cancelable: false }
            //     )
            // }
        }
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}
            >
                <StatusBar barStyle='light-content' />
                <Image
                    source={
                        version === 'sns'
                            ? require('../assets/images/the-source-logo.png')
                            : require('../assets/images/cns-logo.png')
                    }
                    style={{
                        width: 250,
                        height: 100,
                        resizeMode: 'contain',
                        marginBottom: 50,
                    }}
                />
                <Text
                    style={{
                        textAlign: 'center',
                        padding: 20,
                        paddingBottom: 50,
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                >
                    Sorry, there was a problem authenticating your device.
                </Text>
                <Button
                    mode='contained'
                    theme={{
                        roundness: 7,
                        colors: {
                            primary: primaryColor,
                        },
                    }}
                    style={{ padding: 5, marginBottom: 20, marginHorizontal: 30 }}
                    onPress={() => initializeUser()}
                >
                    Try Again
                </Button>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
            <StatusBar barStyle='light-content' />
            <ActivityIndicator />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        error: createUserErrorSelector(state),
        activeDomain: getActiveDomain(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    initializeUser: () => dispatch(globalActions.initializeUser()),
    initializeDeepLinkUser: () => dispatch(globalActions.initializeDeepLinkUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
