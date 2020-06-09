import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar, View, Text, Image } from 'react-native'
import Constants from 'expo-constants'

import { types as userTypes } from '../redux/user'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { createErrorMessageSelector } from '../redux/errors'

import { actions as domainActions, getActiveDomain } from '../redux/domains'

import { handleArticlePress } from '../utils/articlePress'
import { asyncFetchArticle } from '../utils/sagaHelpers'

import { Button } from 'react-native-paper'

import { connect } from 'react-redux'
import { getReleaseChannel } from '../constants/config'

import * as Linking from 'expo-linking'

import NavigationService from '../utils/NavigationService'
import { SplashScreen } from 'expo'

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
    }, [switchingDomain])

    const checkIfDeepLinkUser = async () => {
        const { path, queryParams } = await Linking.parseInitialURLAsync()

        let isDeepSelect = path ? path.includes('deepSelect') : false
        let isDeepLinkArticle = path ? path.includes('article') : false

        if (path && isDeepSelect && !loadedDeepLink) {
            initializeDeepLinkUser()
        } else if (path && isDeepLinkArticle) {
            initializeUser()
        } else {
            console.log('in else')
            initializeUser()
        }
    }

    const handleDeepLinkArticle = async (params, path) => {
        if (params.schoolId == activeDomain.id) {
            // get article
            const article = await asyncFetchArticle(activeDomain.url, Number(params.postId))

            initializeDeepLinkUser(params, path)
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
    initializeDeepLinkUser: (params, path) =>
        dispatch(globalActions.initializeDeepLinkUser(params, path)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
