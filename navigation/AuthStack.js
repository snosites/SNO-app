import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from '../screens/setup/WelcomeScreen'
import SelectScreenContainer from '../containers/screens/SelectScreenContainer'
import DeepSelectScreen from '../screens/setup/DeepSelect'
import LocationSelectContainer from '../containers/screens/LocationSelectContainer'

const AuthStack = createStackNavigator()

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
                    headerBackTitleVisible: false,
                }}
            />
            <AuthStack.Screen name='DeepSelect' component={DeepSelectScreen} />
            <AuthStack.Screen
                name='LocationSelect'
                component={LocationSelectContainer}
                initialParams={{
                    coords: {},
                }}
                options={{
                    title: 'Select a School',
                    headerBackTitleVisible: false,
                }}
            />
        </AuthStack.Navigator>
    )
}
