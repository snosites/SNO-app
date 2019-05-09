import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    SafeAreaView
} from 'react-native';
import { Button, Switch } from 'react-native-paper'
import { Haptic, DangerZone } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';

const { Lottie } = DangerZone;

class initModal extends Component {
    state = {
        animation: null,
        showText: false,
        allNotifications: true
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
                <SafeAreaView style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                        <View style={styles.animationContainer}>
                            <Lottie
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                style={{
                                    width: 250,
                                    height: 250,
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
                                <Text style={{ fontSize: 17, paddingBottom: 30 }}>
                                    Your selected school has been saved.  If you ever want to change this you can find it in your settings.
                                </Text>
                                <Text style={{ fontSize: 17, textAlign: 'center' }}>Notifications for this school are currently:</Text>
                                <View style={{flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 19, fontWeight: 'bold', paddingRight: 10}}>{this.state.allNotifications ? 'ON' : 'OFF'}</Text>
                                    <Switch
                                        color='#2099CE'
                                        value={this.state.allNotifications}
                                        onValueChange={() => { this.setState({ allNotifications: !this.state.allNotifications }); }
                                        }
                                    />
                                </View>
                                <Text style={{ fontSize: 14, paddingBottom: 30 }}>You can always change this later in settings based on individual categories</Text>
                                <Button
                                    mode="contained"
                                    theme={{
                                        roundness: 7,
                                        colors: {
                                            primary: '#2099CE'
                                        }
                                    }}
                                    style={{ padding: 10 }}
                                    onPress={() => {
                                        Haptic.selection();
                                        this.props.handleDismiss(this.state.allNotifications);
                                    }}
                                >
                                    Submit
                                </Button>
                            </View>}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        )
    }

    _startAnimation = () => {
        this._playAnimation();
        setTimeout(() => {
            this.setState({
                showText: true
            })
        }, 700)
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
        marginTop: 10
    },
    animationContainer: {
        width: 250,
        height: 250,
    },
    textContainer: {
        alignContent: 'center',
        marginHorizontal: 20
    },
});

export default initModal;