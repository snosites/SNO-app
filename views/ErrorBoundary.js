import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { Button, TextInput } from 'react-native-paper'
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
                        alignItems: 'center',
                        margin: 20
                    }}
                >
                    <View 
                        style={{
                            paddingTop: 20
                        }}
                    >
                        <Text>We're sorry — something went wrong.</Text>
                        <Text>Our team has been notified, and will work on the issue as fast as possible.</Text>
                    </View>
                    <Button
                        mode='contained'
                        style={{
                            paddingTop: 20
                        }}
                        theme={{
                            roundness: 7,
                            colors: {
                                primary: '#83B33B'
                            }
                        }}
                    >
                        Go To Home Screen
                    </Button>
                    <View
                        style={{
                            paddingTop: 40
                        }}
                    >
                        <Text style={{ textAlign: 'center'}}>
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
                            style={{ paddingBottom: 20 }}
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
                            style={{ paddingBottom: 20 }}
                            onPress={this._handleSubmit}
                        >
                            Submit Feedback
                        </Button>
                    </View>
                </SafeAreaView>
            )
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}