import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Modal
} from 'react-native';
import { Button, Icon } from 'react-native-elements'
import { Haptic, DangerZone } from 'expo';

const { Lottie } = DangerZone;


export default class initModal extends Component {
    state = {
        animation: null,
        showText: false
    };


    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    this.props.nav('Main')
                }}
                onShow={this._startAnimation}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.animationContainer}>
                        <Lottie
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: 300,
                                height: 300,
                            }}
                            loop={false}
                            speed={0.75}
                            duration={1200}
                            source={require('../assets/lottiefiles/success.json')}
                        />
                    </View>
                    {this.state.showText &&
                    <View style={styles.textContainer}>
                        <Text style={{ fontSize: 30, paddingBottom: 10, textAlign: 'center' }}>Success!</Text>
                        <Text style={{ fontSize: 17, paddingBottom: 35 }}>
                            Your selected organization has been saved.  If you ever want to change this you can find it in your settings.
                            </Text>
                        <Button
                            title='Dismiss'
                            buttonStyle={{ backgroundColor: '#01C885', borderRadius: 10, paddingHorizontal: 30 }}
                            onPress={() => {
                                Haptic.selection();
                                this.props.handleDismiss();
                                this.props.navigation.navigate('App')
                            }}
                            titleStyle={{ color: 'white' }}
                        />
                    </View>}
                </View>
            </Modal>
        )
    }

    _startAnimation = () => {
        this._playAnimation();
        setTimeout(() => {
            this.setState({
                showText: true
            })
        }, 1200)
    }

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };
}



const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 30
    },
    animationContainer: {
        width: 300,
        height: 300,
    },
    textContainer: {
        alignContent: 'center',
        marginHorizontal: 30
    },
});