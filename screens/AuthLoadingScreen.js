import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar, View } from 'react-native'
import { SplashScreen } from 'expo'

import { connect } from 'react-redux'
import { setActiveDomain } from '../redux/actionCreators/savedDomains'
import { getApiKey } from '../redux/actionCreators/userInfo'

const AuthLoadingScreen = props => {
    const switchingDomain = props.navigation.getParam('switchingDomain', false)
    const { dispatch, userInfo, domains, navigation } = props

    useEffect(() => {
        if (switchingDomain) {
            return
        }
        _getDomainAsync()
    }, [switchingDomain])

    _getDomainAsync = async () => {
        if (!userInfo.apiKey) {
            dispatch(getApiKey())
        }

        const activeDomain = domains.filter(domain => {
            if (domain.active) {
                return domain
            }
        })
        // sets active domain for app and then navigates to app
        if (activeDomain.length > 0) {
            dispatch(setActiveDomain(activeDomain[0]))
            navigation.navigate('App')
        }
        // no active domain navigate to auth
        else {
            SplashScreen.hide()
            navigation.navigate('Auth')
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
            <StatusBar barStyle='light-content' />
            <ActivityIndicator />
        </View>
    )
}

const mapStateToProps = state => ({
    domains: state.domains,
    userInfo: state.userInfo
})

export default connect(mapStateToProps)(AuthLoadingScreen)
