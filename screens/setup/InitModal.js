import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, Modal, SafeAreaView, Platform } from 'react-native'

import { connect } from 'react-redux'

import { Button, Switch } from 'react-native-paper'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import { ScrollView } from 'react-native-gesture-handler'

import LottieView from 'lottie-react-native'

import { getReleaseChannel } from '../../constants/config'

const version = getReleaseChannel()

// TODO ADD DARK MODE

const InitModal = (props) => {
    const { modalVisible, handleDismiss, theme } = props

    const [showText, setShowText] = useState(false)
    const [allNotifications, setAllNotifications] = useState(true)

    const animationRef = useRef(null)

    _startAnimation = () => {
        _playAnimation()
        setTimeout(() => {
            setShowText(true)
        }, 700)
    }

    _playAnimation = () => {
        animationRef.current.reset()
        animationRef.current.play()
    }

    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                handleDismiss(allNotifications)
            }}
            onShow={_startAnimation}
            contentContainerStyle={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: theme.colors.background,
                }}
            >
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={animationRef}
                            style={{
                                width: 250,
                                height: 250,
                            }}
                            loop={false}
                            speed={0.75}
                            duration={1200}
                            source={require('../../assets/lottiefiles/animation-success.json')}
                        />
                    </View>
                    {showText && (
                        <View style={styles.textContainer}>
                            <Text
                                style={{
                                    fontFamily: 'raleway',
                                    fontSize: 30,
                                    paddingBottom: 10,
                                    textAlign: 'center',
                                    color: theme.colors.text,
                                }}
                            >
                                Success!
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'raleway',
                                    fontSize: 17,
                                    paddingBottom: 30,
                                    color: theme.colors.text,
                                }}
                            >
                                Your selected school has been saved. If you ever want to change this
                                you can find it in your settings.
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'raleway',
                                    fontSize: 17,
                                    textAlign: 'center',
                                    color: theme.colors.text,
                                }}
                            >
                                Notifications for this school are currently:
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 19,
                                        fontFamily: 'ralewayBold',
                                        paddingRight: 10,
                                        color: theme.colors.text,
                                    }}
                                >
                                    {allNotifications ? 'ON' : 'OFF'}
                                </Text>
                                <Switch
                                    color={
                                        version === 'sns'
                                            ? Constants.manifest.extra.highSchool.primary
                                            : Constants.manifest.extra.college.primary
                                    }
                                    value={allNotifications}
                                    onValueChange={() => {
                                        setAllNotifications((prevValue) => !prevValue)
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    fontFamily: 'openSansItalic',
                                    fontSize: 14,
                                    paddingBottom: 30,
                                    color: theme.colors.gray,
                                }}
                            >
                                You can always change this later in settings based on individual
                                categories, and also subscribe to individual writers
                            </Text>
                            <Button
                                mode='contained'
                                theme={{
                                    roundness: 7,
                                    colors: {
                                        primary:
                                            version === 'sns'
                                                ? Constants.manifest.extra.highSchool.primary
                                                : Constants.manifest.extra.college.primary,
                                    },
                                }}
                                style={{ padding: 10 }}
                                onPress={() => {
                                    Haptics.selectionAsync()
                                    handleDismiss(allNotifications)
                                }}
                            >
                                Get Started
                            </Button>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    animationContainer: {
        width: 250,
        height: 250,
    },
    textContainer: {
        alignContent: 'center',
        marginHorizontal: 20,
    },
})

const mapStateToProps = (state) => ({ theme: state.theme })
export default connect(mapStateToProps)(InitModal)
