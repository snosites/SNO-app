import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from '../screens/setup/WelcomeScreen'
import SelectScreenContainer from '../containers/SelectScreenContainer'
import DeepSelectScreen from '../screens/setup/DeepSelect'
import LocationSelect from '../screens/setup/LocationSelect'

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
            <AuthStack.Screen
                name='Welcome'
                component={WelcomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name='Select'
                component={SelectScreenContainer}
                options={{
                    title: 'Select a School',
                }}
            />
            <AuthStack.Screen name='DeepSelect' component={DeepSelectScreen} />
            <AuthStack.Screen name='LocationSelect' component={LocationSelect} />
        </AuthStack.Navigator>
    )
}
