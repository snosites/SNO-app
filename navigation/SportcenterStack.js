import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'

import SportcenterContainer from '../containers/screens/SportcenterScreenContainer'

const Stack = createStackNavigator()

const SportcenterStack = (props) => {
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
            <Stack.Screen
                name='Sportcenter'
                component={SportcenterContainer}
                options={{ title: 'Sports Center' }}
            />
        </Stack.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(SportcenterStack)
