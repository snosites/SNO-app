import React from 'react'
import { StatusBar, View } from 'react-native'
import { connect } from 'react-redux'

import AppNavigator from '../navigation/AppNavigator'
import NotificationAlert from './NotificationAlert'
import NavigationService from '../utils/NavigationService'

import { Provider as PaperProvider } from 'react-native-paper'
import Color from 'color'


const AppContainer = ({theme}) => {
    let primaryColor = Color(theme.colors.primary)
    let isDark = primaryColor.isDark()

    return (
        <View style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                    <AppNavigator
                        screenProps={{ theme: theme }}
                        ref={navigatorRef => {
                            NavigationService.setTopLevelNavigator(navigatorRef)
                        }}
                    />
                </View>
                <NotificationAlert />
            </PaperProvider>
        </View>
    )
}

const mapStateToProps = store => ({
    theme: store.theme
})

export default connect(mapStateToProps)(AppContainer)
