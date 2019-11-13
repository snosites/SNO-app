import React, { useEffect, useRef } from 'react'
import {
    View,
    Dimensions,
    Image,
    ImageBackground
} from 'react-native'
import Constants from 'expo-constants'
import LottieView from 'lottie-react-native'
import { connect } from 'react-redux'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getActiveDomain } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

import anim from '../assets/lottiefiles/infinite-loading-bar'
import anim2 from '../assets/lottiefiles/cns-splash-loading'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const ANIMATION_WIDTH = viewportWidth
const ANIMATION_BOTTOM_PADDING = viewportHeight * 0.0

const startupErrorSelector = createErrorMessageSelector([globalTypes.STARTUP])
const startupLoadingSelector = createLoadingSelector([globalTypes.STARTUP])

const AppSetupScreen = props => {
    const {
        user,
        activeDomain,
        startup,
        splashScreen,
        startupError,
        isLoading,
        menus,
        articlesByCategory,
        navigation
    } = props

    const animationRef = useRef(null)

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
        //run startup saga
        startup(activeDomain)
    }, [])

    useEffect(() => {
        if (startupError === 'error initializing app') {
            navigation.navigate('Error', {
                errorMessage: 'Sorry, this school is currently unavailable'
            })
        }
        if (startupError === 'school not in DB') {
            navigation.navigate('Error', {
                errorMessage:
                    'Sorry, this school did not renew its Student News Source subscription'
            })
        }
    }, [startupError])

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
                flex: 1
            }}
        >
            <ImageBackground
                source={require('../assets/images/the-source-splash.png')}
                source={
                    Constants.manifest.releaseChannel === 'sns'
                        ? require('../assets/images/the-source-splash.png')
                        : require('../assets/images/cns-splash.png')
                }
                resizeMode='cover'
                style={{
                    width: viewportWidth,
                    height: viewportHeight,
                    flex: 1
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: viewportWidth,
                        height: viewportHeight,
                        paddingBottom: ANIMATION_BOTTOM_PADDING
                    }}
                >
                    <View>
                        <LottieView
                            ref={animationRef}
                            resizeMode='cover'
                            style={{
                                width: ANIMATION_WIDTH,
                                height: 325
                            }}
                            loop={true}
                            speed={0.5}
                            autoPlay={true}
                            source={Constants.manifest.releaseChannel === 'sns' ? anim : anim2}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const mapStateToProps = state => ({
    activeDomain: getActiveDomain(state),
    user: state.user,
    splashScreen: state.global.splashScreen,
    isLoading: startupLoadingSelector(state),
    startupError: startupErrorSelector(state),
    menus: state.global.menuItems,
    articlesByCategory: state.articlesByCategory
})

const mapDispatchToProps = dispatch => ({
    startup: domain => dispatch(globalActions.startup(domain))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppSetupScreen)
