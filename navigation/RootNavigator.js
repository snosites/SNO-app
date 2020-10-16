import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
// import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from '@react-navigation/stack'

import AuthLoadingScreen from '../screens/setup/AuthLoadingScreen'
import AppStack from './AppStack'

import InitScreen from '../screens/setup/WelcomeScreen'
import SelectScreen from '../screens/SelectScreen'
import LocationSelect from '../screens/setup/LocationSelect'
import ErrorBoundary from '../screens/ErrorBoundary'

import DeepSelectScreen from '../screens/setup/DeepSelect'
import { createLoadingSelector } from '../redux/loading'

const AuthStack = createStackNavigator()

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

// export default function AppContainer() {
//     return (
//         <NavigationContainer>
//             {createSwitchNavigator(
//                 {
//                     AuthLoading: AuthLoadingScreen,
//                     App: {
//                         screen: AppStackWithErrorBoundary,
//                         path: 'app',
//                     },
//                     Auth: {
//                         screen: AuthStack,
//                         path: 'auth',
//                     },
//                 },
//                 {
//                     initialRouteName: 'AuthLoading',
//                 }
//             )}
//         </NavigationContainer>
//     )
// }
export default function AuthNavigator() {
    return (
        <NavigationContainer>
            <AuthLoadingScreen />
        </NavigationContainer>
    )
}
