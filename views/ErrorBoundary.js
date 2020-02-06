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
    TouchableOpacity,
    StatusBar
} from 'react-native'
import { Button, TextInput } from 'react-native-paper'

import NavigationService from '../utils/NavigationService'

import * as Sentry from 'sentry-expo'

export default class ErrorBoundary extends React.Component {
    state = {
        error: null,
        feedback: '',
        eventId: null,
        submitting: false,
        successful: false
    }

    componentDidCatch(error, errorInfo) {
        console.log('error boundary')
        this.setState({ error })
        Sentry.captureException(error, { extra: errorInfo })
        // Sentry.setEventSentSuccessfully((event) => {
        //     console.log(Sentry.lastEventId())
        // });
    }

    render() {
        const { error, submitting, successful } = this.state
        if (error) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1
                    }}
                >
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        <KeyboardAvoidingView
                            style={{
                                flex: 1
                            }}
                            behavior='position'
                            enabled
                        >
                            <StatusBar barStyle={'dark-content'} />
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
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                        We're sorry — something went wrong.
                                    </Text>
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                        If you are the account owner, please submit a support
                                        request.
                                    </Text>
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
                                    onPress={() => {
                                        this.setState({
                                            error: null,
                                            feedback: '',
                                            eventId: null,
                                            submitting: false
                                        })
                                        NavigationService.navigate('AuthLoading')
                                    }}
                                >
                                    Go To Home Screen
                                </Button>
                                <View
                                    style={{
                                        paddingTop: 20
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                        Or if you would like to submit feedback about your app
                                        experience please do so below.
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
                                        onSubmitEditing={this._handleSubmit}
                                        value={this.state.feedback}
                                        onChangeText={feedback => this.setState({ feedback })}
                                    />
                                    {successful ? (
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 17,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Thank you for your feedback
                                        </Text>
                                    ) : (
                                        <Button
                                            mode='contained'
                                            loading={submitting}
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
                                    )}
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </SafeAreaView>
            )
        } else {
            //when there's not an error, render children untouched
            return this.props.children
        }
    }

    _handleSubmit = async () => {
        const { feedback, eventId } = this.state
        this.setState({
            submitting: true
        })
        setTimeout(() => {
            this.setState({
                successful: true
            })
        }, 1000)
        Sentry.captureMessage(`FEEDBACK: ${feedback}`)
        setTimeout(() => {
            this.setState({
                successful: false,
                error: null,
                feedback: '',
                eventId: null,
                submitting: false
            })
            NavigationService.navigate('AuthLoading')
        }, 2000)
    }
}
