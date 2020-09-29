import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
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
    const {
        initializeUser,
        initializeDeepLinkUser,
        error,
        activeDomain,
        setDeepLinkArticle,
        fromDeepLink,
        setFromDeepLink,
    } = props

    useEffect(() => {
        if (switchingDomain) {
            return
        }
        if (fromDeepLink) {
            handleFromDeepLink()
        } else {
            initializeUser()
        }
    }, [switchingDomain, fromDeepLink])

    const handleFromDeepLink = async () => {
        const { path, queryParams } = await Linking.parseInitialURLAsync()

        let isDeepSelect = path ? path.includes('deepSelect') : false
        let isDeepLinkArticle = path ? path.includes('article') : false

        if (path && isDeepSelect) {
            initializeDeepLinkUser({ schoolId: queryParams.schoolId })
        } else if (path && isDeepLinkArticle) {
            console.log('is deep link article', queryParams)
            setDeepLinkArticle({ params: queryParams, path })
            initializeUser()
        } else {
            initializeUser()
        }
        setFromDeepLink(false)
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
                <StatusBar style='light' />
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
            <StatusBar style='light' />
            <ActivityIndicator />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        error: createUserErrorSelector(state),
        activeDomain: getActiveDomain(state),
        fromDeepLink: state.global.fromDeepLink,
    }
}

const mapDispatchToProps = (dispatch) => ({
    initializeUser: () => dispatch(globalActions.initializeUser()),
    initializeDeepLinkUser: (params) => dispatch(globalActions.initializeDeepLinkUser(params)),
    setDeepLinkArticle: (payload) => dispatch(globalActions.setDeepLinkArticle(payload)),
    setFromDeepLink: (payload) => dispatch(globalActions.setFromDeepLink(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
