import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar, View, Text, Image } from 'react-native'
import Constants from 'expo-constants'

import { types as userTypes } from '../redux/user'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { createErrorMessageSelector } from '../redux/errors'

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
    const { initializeUser, initializeDeepLinkUser, error } = props

    useEffect(() => {
        if (switchingDomain) {
            return
        }

        checkIfDeepLinkUser()
        // determine if coming from deep link
    }, [switchingDomain])

    const checkIfDeepLinkUser = async () => {
        const url = await Linking.getInitialURL()
        console.log('url', url)

        Linking.addEventListener('url', (x) => console.log('x', x))

        if (url) {
            initializeDeepLinkUser()
        } else {
            console.log('in else')
            // initializeUser()
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
    }
}

const mapDispatchToProps = (dispatch) => ({
    initializeUser: () => dispatch(globalActions.initializeUser()),
    initializeDeepLinkUser: () => dispatch(globalActions.initializeDeepLinkUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
