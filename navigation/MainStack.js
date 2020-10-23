import React, { useEffect, useRef, useState } from 'react'
import { View, useWindowDimensions, Image, ImageBackground } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import LottieView from 'lottie-react-native'

import ErrorScreen from '../screens/ErrorScreen'
import TabNavigatorContainer from '../containers/TabNavigatorContainer'

import snsAnimation from '../assets/lottiefiles/infinite-loading-bar'
import cnsAnimation from '../assets/lottiefiles/cns-splash-loading'

import { getReleaseChannel } from '../constants/config'
import { init } from 'sentry-expo'

const version = getReleaseChannel()

const Stack = createStackNavigator()

export default (props) => {
    const { activeDomain, startup, splashScreen, startupError, startupLoading, initialized } = props

    const animationRef = useRef(null)
    const window = useWindowDimensions()

    const ANIMATION_WIDTH = window.width
    const ANIMATION_BOTTOM_PADDING = window.height * 0.0

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
        if (!initialized) startup(activeDomain)
    }, [initialized])

    if (!initialized) {
        if (splashScreen) {
            return (
                <View style={{ flex: 1, backgroundColor: 'green' }}>
                    <Image
                        source={{ uri: splashScreen }}
                        style={{ width: window.width, height: window.height }}
                        resizeMode='cover'
                    />
                </View>
            )
        }
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <ImageBackground
                    source={
                        version === 'sns'
                            ? require('../assets/images/the-source-splash.png')
                            : require('../assets/images/cns-splash.png')
                    }
                    resizeMode='cover'
                    style={{
                        width: window.width,
                        height: window.height,
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: window.width,
                            height: window.height,
                            paddingBottom: ANIMATION_BOTTOM_PADDING,
                        }}
                    >
                        <View>
                            <LottieView
                                ref={animationRef}
                                resizeMode='cover'
                                style={{
                                    width: ANIMATION_WIDTH,
                                    height: 325,
                                }}
                                loop={true}
                                speed={0.5}
                                autoPlay={true}
                                source={version === 'sns' ? snsAnimation : cnsAnimation}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    return (
        <Stack.Navigator>
            {startupError ? (
                <Stack.Screen
                    name='Error'
                    component={ErrorScreen}
                    options={{
                        headerShown: false,
                    }}
                    initialParams={{
                        errorMessage:
                            startupError === 'error initializing app'
                                ? 'Sorry, this school is currently unavailable'
                                : startupError === 'school not in DB'
                                ? 'Sorry, this school did not renew its Student News Source subscription'
                                : null,
                    }}
                />
            ) : (
                // no startup errors
                <Stack.Screen
                    name='App'
                    options={{
                        headerShown: false,
                    }}
                    component={TabNavigatorContainer}
                />
            )}
        </Stack.Navigator>
    )
}
