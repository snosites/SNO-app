import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from '../screens/setup/WelcomeScreen'
import SelectScreen from '../screens/setup/SelectScreen'
import DeepSelectScreen from '../screens/setup/DeepSelect'
import LocationSelect from '../screens/setup/LocationSelect'
import ErrorBoundary from '../views/ErrorBoundary'

const AuthStack = createStackNavigator()

// const AuthStack = createStackNavigator({
//     Init: InitScreen,
//     Select: {
//         screen: SelectScreen,
//         path: 'select/:schoolId',
//     },
//     DeepSelect: {
//         screen: DeepSelectScreen,
//         path: 'deepSelect/:schoolId',
//     },
//     LocationSelect: LocationSelect,
// })

export default () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name='Welcome' component={WelcomeScreen} />
            <AuthStack.Screen name='Select' component={SelectScreen} />
            <AuthStack.Screen name='DeepSelect' component={DeepSelectScreen} />
            <AuthStack.Screen name='LocationSelect' component={LocationSelect} />
        </AuthStack.Navigator>
    )
}
