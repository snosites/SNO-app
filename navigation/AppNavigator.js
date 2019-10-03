import React from 'react'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'

import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import AppStack from './AppStack'

import InitScreen from '../screens/InitScreen'
import SelectScreen from '../screens/SelectScreen'
import LocationSelect from '../screens/LocationSelect'
import ErrorBoundary from '../views/ErrorBoundary'


const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: SelectScreen,
    LocationSelect: LocationSelect

});

class AppStackWithErrorBoundary extends React.Component {
    static router = AppStack.router;
    render() {
        const { navigation, screenProps } = this.props;
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
            App: AppStackWithErrorBoundary,
            Auth: AuthStack
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
)



