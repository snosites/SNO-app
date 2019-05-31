import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native';

import Sentry from 'sentry-expo';

export default class ErrorBoundary extends React.Component {

    state = { 
        error: null 
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Sentry.captureException(error, { extra: errorInfo });
    }
    render() {
        if (this.state.error) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text>We're sorry — something went wrong.</Text>
                    <Text>Our team has been notified, and will work on the issue as fast as possible.</Text>
                </View>
            )
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}