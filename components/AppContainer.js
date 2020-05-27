import React from 'react'
import { StatusBar, View } from 'react-native'
import { connect } from 'react-redux'

import AppNavigator from '../navigation/AppNavigator'
import NotificationAlert from './NotificationAlert'
import NavigationService from '../utils/NavigationService'

import { Provider as PaperProvider } from 'react-native-paper'
import Color from 'color'

import * as Linking from 'expo-linking'

const prefix = Linking.makeUrl('/')
console.log('prefix', prefix)

// Need to check if coming from a deep link to handle startup logic

const AppContainer = ({ theme, homeScreenMode }) => {
    let primaryColor = Color(theme.colors.primary)
    let isDark = primaryColor.isDark()

    return (
        <PaperProvider theme={theme}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <AppNavigator
                    uriPrefix={prefix}
                    screenProps={{ theme: theme, homeScreenMode: homeScreenMode }}
                    ref={(navigatorRef) => {
                        NavigationService.setTopLevelNavigator(navigatorRef)
                    }}
                />
            </View>
            <NotificationAlert />
        </PaperProvider>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    homeScreenMode: state.global.homeScreenMode,
})

export default connect(mapStateToProps)(AppContainer)
