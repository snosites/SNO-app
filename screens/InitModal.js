import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal
} from 'react-native';
import { Button } from 'react-native-paper'
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
                            source={require('../assets/lottiefiles/animation-success.json')}
                        />
                    </View>
                    {this.state.showText &&
                    <View style={styles.textContainer}>
                        <Text style={{ fontSize: 30, paddingBottom: 10, textAlign: 'center' }}>Success!</Text>
                        <Text style={{ fontSize: 17, paddingBottom: 35 }}>
                            Your selected organization has been saved.  If you ever want to change this you can find it in your settings.
                            </Text>
                        <Button
                            mode="contained"
                            theme={{
                                roundness: 7,
                                colors: {
                                primary: '#2099CE'
                            }}}
                            style={{ padding: 10 }}
                            onPress={() => {
                                Haptic.selection();
                                this.props.handleDismiss();
                            }}
                        >
                            Dismiss
                        </Button>
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