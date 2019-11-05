import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar, View, Text, Image } from 'react-native'
import { SplashScreen } from 'expo'
import Constants from 'expo-constants'

import { types as userTypes, actions as userActions } from '../redux/user'
import { actions as domainsActions } from '../redux/domains'
import { createErrorMessageSelector } from '../redux/errors'

import { Button } from 'react-native-paper'

import { connect } from 'react-redux'

const primaryColor =
    Constants.manifest.releaseChannel === 'sns'
        ? Constants.manifest.extra.highschool.primary
        : Constants.manifest.extra.college.primary
const createUserErrorSelector = createErrorMessageSelector([userTypes.FIND_OR_CREATE_USER])

const AuthLoadingScreen = props => {
    const switchingDomain = props.navigation.getParam('switchingDomain', false)
    const { findOrCreateUser, setActiveDomain, user, domains, navigation, error } = props

    useEffect(() => {
        if (!user.user.api_token) {
            findOrCreateUser()
            return
        }
        // if (switchingDomain) {
        //     return
        // }
        _getDomainAsync()
    }, [user.user.api_token])

    _getDomainAsync = async () => {
        const activeDomain = domains.filter(domain => {
            if (domain.active) {
                return domain
            }
        })
        // sets active domain for app and then navigates to app
        if (activeDomain.length > 0) {
            setActiveDomain(activeDomain[0].id)
            navigation.navigate('App')
        }
        // no active domain navigate to auth
        else {
            SplashScreen.hide()
            navigation.navigate('Auth')
        }
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}
            >
                <StatusBar barStyle='light-content' />
                <Image
                    source={
                        Constants.manifest.releaseChannel === 'sns'
                            ? require('../assets/images/the-source-logo.png')
                            : require('../assets/images/cns-logo.png')
                    }
                    style={{
                        width: 250,
                        height: 100,
                        resizeMode: 'contain',
                        marginBottom: 50
                    }}
                />
                <Text
                    style={{
                        textAlign: 'center',
                        padding: 20,
                        paddingBottom: 50,
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'black'
                    }}
                >
                    Sorry, there was a problem authenticating your device.
                </Text>
                <Button
                    mode='contained'
                    theme={{
                        roundness: 7,
                        colors: {
                            primary: primaryColor
                        }
                    }}
                    style={{ padding: 5, marginBottom: 20, marginHorizontal: 30 }}
                    onPress={() => findOrCreateUser()}
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

const mapStateToProps = state => {
    return {
        domains: state.domains,
        user: state.user,
        error: createUserErrorSelector(state)
    }
}

const mapDispatchToProps = dispatch => ({
    findOrCreateUser: () => dispatch(userActions.findOrCreateUser()),
    setActiveDomain: domainId => dispatch(domainsActions.setActiveDomain(domainId))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthLoadingScreen)
