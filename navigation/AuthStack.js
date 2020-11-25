import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { connect } from 'react-redux'
import { actions as themeActions } from '../redux/theme'

import WelcomeScreen from '../screens/setup/WelcomeScreen'
import SelectScreenContainer from '../containers/screens/SelectScreenContainer'
import LocationSelectContainer from '../containers/screens/LocationSelectContainer'

const Stack = createStackNavigator()

const AuthStack = ({ theme, toggleDarkMode }) => {
    useEffect(() => {
        if (theme.dark) {
            toggleDarkMode(true)
        } else {
            toggleDarkMode(false)
        }
    }, [theme.dark])
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Welcome'
                component={WelcomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Select'
                component={SelectScreenContainer}
                options={{
                    title: 'Select a School',
                    headerBackTitleVisible: false,
                }}
            />
            <Stack.Screen
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
        </Stack.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
    toggleDarkMode: (darkMode) => dispatch(themeActions.toggleDarkMode(darkMode)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthStack)
