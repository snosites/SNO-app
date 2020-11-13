import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import SettingsScreenContainer from '../containers/SettingsScreenContainer'

const Stack = createStackNavigator()

const SettingsStack = (props) => {
    const { theme, headerLogo } = props

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.primaryIsDark ? '#fff' : '#000',
                headerLeft: () => {
                    if (headerLogo) {
                        return (
                            <Image
                                source={{ uri: headerLogo }}
                                style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                                resizeMode='contain'
                            />
                        )
                    }
                    return null
                },
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name='Settings' component={SettingsScreenContainer} />
        </Stack.Navigator>
    )
}

export default SettingsStack
