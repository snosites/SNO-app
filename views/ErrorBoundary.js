import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { Button, TextInput } from 'react-native-paper'

import NavigationService from '../utils/NavigationService';

import Sentry from 'sentry-expo';

export default class ErrorBoundary extends React.Component {

    state = {
        error: null,
        feedback: ''
    }

    componentDidCatch(error, errorInfo) {
        console.log('error boundary error')
        this.setState({ error });
        Sentry.captureException(error, { extra: errorInfo });
    }
    render() {
        if (this.state.error) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                    }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <KeyboardAvoidingView
                            style={{
                                flex: 1,
                            }}
                            behavior="position"
                            enabled
                        >
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    margin: 20
                                }}
                            >
                                <View
                                    style={{
                                        paddingTop: 20
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>We're sorry — something went wrong.</Text>
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>Our team has been notified, and will work on the issue as fast as possible.</Text>
                                </View>
                                <Button
                                    mode='contained'
                                    style={{
                                        marginTop: 20
                                    }}
                                    theme={{
                                        roundness: 7,
                                        colors: {
                                            primary: '#2099CE'
                                        }
                                    }}
                                    onPress={() => NavigationService.navigate('AuthLoading')}
                                >
                                    Go To Home Screen
                            </Button>
                                <View
                                    style={{
                                        paddingTop: 20
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                        Or if you would like to submit feedback about your app experience please do so below.
                        </Text>
                                </View>
                                <View
                                    style={{
                                        paddingTop: 20,
                                        alignItems: 'center'
                                    }}
                                >
                                    <TextInput
                                        label='Feedback'
                                        style={{ marginBottom: 20, width: 300, height: 150 }}
                                        theme={{
                                            roundness: 7,
                                            colors: {
                                                background: 'white',
                                                primary: '#2099CE'
                                            }
                                        }}
                                        multiline
                                        mode='outlined'
                                        selectionColor='black'
                                        returnKeyType='submit'
                                        onSubmitEditing={this._handleSubmit}
                                        value={this.state.feedback}
                                        onChangeText={feedback => this.setState({ feedback })}

                                    />
                                    <Button
                                        mode="contained"
                                        theme={{
                                            roundness: 7,
                                            colors: {
                                                primary: '#2099CE'
                                            }
                                        }}
                                        style={{ marginBottom: 20 }}
                                        onPress={this._handleSubmit}
                                    >
                                        Submit Feedback
                                </Button>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </SafeAreaView>
            )
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}