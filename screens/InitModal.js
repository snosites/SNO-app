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
    };

    componentWillMount() {
        this._playAnimation();
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    this.props.nav('Main')
                }}
                style={{ flex: 1 }}
            >
                <View style={styles.animationContainer}>
                    {this.state.animation &&
                        <Lottie
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: 400,
                                height: 400,
                                backgroundColor: '#eee',
                            }}
                            source={this.state.animation}
                        />}
                    <View style={styles.buttonContainer}>
                        <Button title="Restart Animation" onPress={this._playAnimation} />
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, paddingBottom: 10, color: '#517fa4', fontWeight: 'bold' }}>Great!</Text>
                        <Text style={{ fontSize: 17, paddingBottom: 25 }}>
                            Your selected organization has been saved.  If you ever want to change this you can find it in your settings.
                            </Text>
                        <Button
                            title='Dismiss'
                            buttonStyle={{ backgroundColor: '#9A1D20', borderRadius: 10, paddingHorizontal: 30 }}
                            onPress={() => {
                                Haptic.selection();
                                this.props.handleDismiss();
                                this.props.nav('Main')
                            }}
                            titleStyle={{ color: 'white' }}
                        />
                    </View>
                </View>
            </Modal>
        )
    }

    _playAnimation = () => {
        console.log('in play ani')
        if (!this.state.animation) {
            this._loadAnimationAsync();
        } else {
            this.animation.reset();
            this.animation.play();
        }
    };

    _loadAnimationAsync = async () => {
        console.log('in load ani')
        let result = await fetch(
            'https://cdn.rawgit.com/airbnb/lottie-react-native/635163550b9689529bfffb77e489e4174516f1c0/example/animations/Watermelon.json'
        )
            .then(data => {
                return data.json();
            })
            .catch(error => {
                console.error(error);
            });
        this.setState({ animation: result }, this._playAnimation);
    };
}



const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    textContainer: {
        flex: 1,
        paddingTop: 20,
    },
});