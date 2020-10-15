import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { connect } from 'react-redux'

import { types as globalTypes, actions as globalActions } from '../redux/global'

import AuthStack from '../navigation/AuthStack'
import AppStack from '../navigation/AppStack'
import NotificationAlert from './NotificationAlert'
import NavigationService from '../utils/NavigationService'

import { Provider as PaperProvider } from 'react-native-paper'
import Color from 'color'

import * as Linking from 'expo-linking'

// const prefix = Linking.makeUrl('/')

const Stack = createStackNavigator()

const AppContainer = (props) => {
    const {
        initializeUser,
        initializeUserLoading,
        initializeUserError,
        initializeDeepLinkUser,
        activeDomain,
        setDeepLinkArticle,
        fromDeepLink,
        setFromDeepLink,
        theme,
        homeScreenMode,
    } = props

    let primaryColor = Color(theme.colors.primary)
    let isDark = primaryColor.isDark()

    useEffect(() => {
        initializeUser()
    }, [])
    useEffect(() => {
        if (!initializeUserLoading && !initializeUserError) {
        }
    }, [initializeUserLoading, initializeUserError])
    // useEffect(() => {
    //     if (switchingDomain) {
    //         return
    //     }
    //     if (fromDeepLink) {
    //         handleFromDeepLink()
    //     } else {
    //         initializeUser()
    //     }
    // }, [switchingDomain, fromDeepLink])

    const checkIfDeepLinkUser = async () => {
        const { path, queryParams } = await Linking.parseInitialURLAsync()

        let isDeepSelect = path ? path.includes('deepSelect') : false
        let isDeepLinkArticle = path ? path.includes('article') : false

        if (path && (isDeepSelect || isDeepLinkArticle)) {
            setFromDeepLink(true)
        }
    }

    return (
        <PaperProvider theme={theme}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <NavigationContainer>
                    <Stack.Navigator>
                        {activeDomain.length ? (
                            // doesn't have a saved domain
                            <Stack.Screen
                                name='Auth'
                                component={AuthStack}
                                options={{
                                    title: 'Sign in',
                                    // When logging out, a pop animation feels intuitive
                                    // You can remove this if you want the default 'push' animation
                                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                                }}
                            />
                        ) : (
                            // has domain saved
                            <Stack.Screen name='App' component={AppStack} />
                        )}
                    </Stack.Navigator>
                </NavigationContainer>

                {/* <AuthNavigator
                    uriPrefix={prefix}
                    enableURLHandling={false}
                    screenProps={{ theme: theme, homeScreenMode: homeScreenMode }}
                    ref={(navigatorRef) => {
                        NavigationService.setTopLevelNavigator(navigatorRef)
                    }}
                /> */}
            </View>
            <NotificationAlert />
        </PaperProvider>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    homeScreenMode: state.global.homeScreenMode,
})

const mapDispatchToProps = (dispatch) => ({
    setFromDeepLink: (payload) => dispatch(globalActions.setFromDeepLink(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
