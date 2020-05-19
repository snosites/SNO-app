import React from 'react'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'

import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import AppStack from './AppStack'

import InitScreen from '../screens/InitScreen'
import SelectScreen from '../screens/SelectScreen'
import LocationSelect from '../screens/LocationSelect'
import ErrorBoundary from '../views/ErrorBoundary'

import DeepSelectScreen from '../screens/DeepSelect'

const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: {
        screen: SelectScreen,
        path: 'select/:schoolId',
    },
    DeepSelect: {
        screen: DeepSelectScreen,
        path: 'deepSelect/:schoolId',
    },
    LocationSelect: LocationSelect,
})

//add custom screen with params for deep linking

class AppStackWithErrorBoundary extends React.Component {
    static router = AppStack.router
    render() {
        const { navigation, screenProps } = this.props
        return (
            <ErrorBoundary navigation={navigation}>
                <AppStack navigation={navigation} screenProps={screenProps} />
            </ErrorBoundary>
        )
    }
}

export default AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: {
                screen: AppStackWithErrorBoundary,
                path: '',
            },
            Auth: {
                screen: AuthStack,
                path: 'auth',
            },
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
)
