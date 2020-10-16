import React, { useEffect, useRef } from 'react'
import { View, Dimensions, Image, ImageBackground } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import ErrorScreen from '../screens/ErrorScreen'
import TabNavigator from './TabNavigator'

import snsAnimation from '../assets/lottiefiles/infinite-loading-bar'
import cnsAnimation from '../assets/lottiefiles/cns-splash-loading'

import { getReleaseChannel } from '../constants/config'

const version = getReleaseChannel()

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
const ANIMATION_WIDTH = viewportWidth
const ANIMATION_BOTTOM_PADDING = viewportHeight * 0.0

const Stack = createStackNavigator()

export default (props) => {
    const { activeDomain, startup, splashScreen, startupError, startupLoading } = props

    const animationRef = useRef(null)

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
        //run startup saga
        startup(activeDomain)
    }, [])

    if (startupLoading) {
        if (splashScreen) {
            return (
                <Image
                    source={{ uri: splashScreen }}
                    style={{ width: viewportWidth, height: viewportHeight }}
                    resizeMode='cover'
                />
            )
        }
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <ImageBackground
                    source={require('../assets/images/the-source-splash.png')}
                    source={
                        version === 'sns'
                            ? require('../assets/images/the-source-splash.png')
                            : require('../assets/images/cns-splash.png')
                    }
                    resizeMode='cover'
                    style={{
                        width: viewportWidth,
                        height: viewportHeight,
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: viewportWidth,
                            height: viewportHeight,
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
                    initialParams={{
                        errorMessage:
                            startupError === 'error initializing app'
                                ? 'Sorry, this school is currently unavailable'
                                : 'Sorry, this school did not renew its Student News Source subscription',
                    }}
                />
            ) : (
                // no startup errors
                <Stack.Screen name='App' component={TabNavigator} />
            )}
        </Stack.Navigator>
    )
}
