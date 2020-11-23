import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    useWindowDimensions,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    Animated,
} from 'react-native'
import {
    createStackNavigator,
    CardStyleInterpolators,
    TransitionSpecs,
    TransitionPresets,
} from '@react-navigation/stack'
import LottieView from 'lottie-react-native'

import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

import ErrorScreen from '../screens/ErrorScreen'

import ArticleNavigator from '../navigation/ArticleNavigator'
import TabNavigatorContainer from '../containers/navigators/TabNavigatorContainer'
import UserInfoModalContainer from '../containers/screens/UserInfoModalContainer'
import ProfileScreenContainer from '../containers/screens/ProfileScreenContainer'
import ProfileModalContainer from '../containers/screens/ProfileModalScreenContainer'

// same animation but different colors
import snsAnimation from '../assets/lottiefiles/infinite-loading-bar'
import cnsAnimation from '../assets/lottiefiles/cns-splash-loading'

import { getReleaseChannel } from '../constants/config'

const version = getReleaseChannel()

const Stack = createStackNavigator()

const { add, multiply } = Animated

export default (props) => {
    const { theme, activeDomain, startup, splashScreen, startupError, initialized } = props

    const animationRef = useRef(null)
    const window = useWindowDimensions()

    const ANIMATION_WIDTH = window.width
    const ANIMATION_BOTTOM_PADDING = window.height * 0.0

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
        if (!initialized && activeDomain.id) startup(activeDomain)
    }, [initialized])

    if (!initialized) {
        if (splashScreen) {
            return (
                <View style={{ flex: 1 }}>
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
        <Stack.Navigator mode={'modal'}>
            {startupError ? (
                <Stack.Screen
                    name='Error'
                    component={ErrorScreen}
                    options={{ headerShown: false }}
                    initialParams={{
                        errorMessage:
                            startupError === 'error initializing app'
                                ? 'Sorry, this school is currently unavailable'
                                : startupError === 'school not in DB'
                                ? 'Sorry, this school did not renew its Student News Source subscription'
                                : 'There was an error.  x77',
                    }}
                />
            ) : (
                <>
                    <Stack.Screen
                        name='Tabs'
                        component={TabNavigatorContainer}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='UserInfoModal'
                        component={UserInfoModalContainer}
                        options={{
                            headerShown: false,
                            cardStyle: { backgroundColor: 'transparent' },
                            cardOverlayEnabled: true,
                            cardStyleInterpolator: ({
                                current: { progress },
                                inverted,
                                layouts: { screen },
                            }) => {
                                const translateY = multiply(
                                    progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [screen.height, 0],
                                        extrapolate: 'clamp',
                                    }),
                                    inverted
                                )
                                return {
                                    cardStyle: {
                                        transform: [
                                            // Translation for the animation of the current card
                                            { translateY },
                                        ],
                                        opacity: progress.interpolate({
                                            inputRange: [0, 0.5, 0.9, 1],
                                            outputRange: [0, 0.25, 0.7, 1],
                                        }),
                                    },
                                    overlayStyle: {
                                        opacity: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 0.5],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                }
                            },
                        }}
                    />
                    <Stack.Screen
                        name='ProfileModal'
                        component={ProfileModalContainer}
                        options={{
                            headerShown: false,
                            cardStyle: { backgroundColor: 'transparent' },
                            cardOverlayEnabled: true,
                            cardStyleInterpolator: ({
                                current: { progress },
                                inverted,
                                layouts: { screen },
                            }) => {
                                const translateY = multiply(
                                    progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [screen.height, 0],
                                        extrapolate: 'clamp',
                                    }),
                                    inverted
                                )
                                return {
                                    cardStyle: {
                                        transform: [
                                            // Translation for the animation of the current card
                                            { translateY },
                                        ],
                                        opacity: progress.interpolate({
                                            inputRange: [0, 0.5, 0.9, 1],
                                            outputRange: [0, 0.25, 0.7, 1],
                                        }),
                                    },
                                    overlayStyle: {
                                        opacity: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 0.5],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                }
                            },
                        }}
                    />
                    <Stack.Screen
                        name='FullProfile'
                        component={ProfileScreenContainer}
                        options={{
                            headerTitle: null,
                            headerBackTitleVisible: false,
                            // headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='ArticleNavigator'
                        component={ArticleNavigator}
                        options={{ headerShown: false }}
                        // options={({ route, navigation }) => ({
                        //     headerTitle: null,
                        //     headerRight: () => {
                        //         return (
                        //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        //                 <TouchableOpacity
                        //                     onPress={() => {}}
                        //                     style={{
                        //                         justifyContent: 'center',
                        //                         alignItems: 'stretch',
                        //                         padding: 10,
                        //                     }}
                        //                 >
                        //                     <AntDesign
                        //                         name={'like2'}
                        //                         size={25}
                        //                         style={{ marginBottom: -3 }}
                        //                         color={theme.colors.accent}
                        //                     />
                        //                 </TouchableOpacity>
                        //                 <TouchableOpacity
                        //                     onPress={() => {
                        //                         navigation.navigate('ArticleActions')
                        //                     }}
                        //                     style={{
                        //                         justifyContent: 'center',
                        //                         alignItems: 'stretch',
                        //                         padding: 10,
                        //                     }}
                        //                 >
                        //                     <MaterialCommunityIcons
                        //                         name={'dots-horizontal'}
                        //                         backgroundColor={'transparant'}
                        //                         size={25}
                        //                         style={{ marginBottom: -3 }}
                        //                         color={theme.colors.accent}
                        //                     />
                        //                 </TouchableOpacity>
                        //             </View>
                        //         )
                        //     },
                        //     headerBackTitleVisible: false,
                        // })}
                    />
                </>
            )}
        </Stack.Navigator>
    )
}
