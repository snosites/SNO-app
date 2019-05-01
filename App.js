import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, ActivityIndicator } from 'react-native';
import { AppLoading, Asset, Font, Icon, Notifications } from 'expo';

import { Provider as ReduxProvider, connect } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import { Provider as PaperProvider, DefaultTheme, Colors, Snackbar, Portal } from 'react-native-paper';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/configureStore';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.blue500,
        accent: Colors.blue800,
    }
};

class AppNavigatorContainer extends React.Component {
    state = {
        notification: {},
        visible: false
    };

    componentDidMount() {
        const { userInfo } = this.props;
        if (userInfo.tokenId) {
            this._notificationSubscription = Notifications.addListener(this._handleNotification);
        }
    }

    _handleNotification = (notification) => {
        console.log('new notification', notification)
        this.setState({ notification });

        if (notification.origin == 'received') {
            this.setState({
                visible: true
            })
            setTimeout(() => {
                this.setState({
                    visible: false
                })
            }, 3000)
        }
    };

    render() {
        const { notification, visible } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Portal>
                    <Snackbar
                        style={{ marginBottom: 60, zIndex: 100 }}
                        visible={visible}
                        onDismiss={() => this.setState({ visible: false })}
                        action={{
                            label: 'View',
                            onPress: () => {
                                // 
                            },
                        }}
                    >
                        New Article Posted!
                    </Snackbar>
                </Portal>
                <AppNavigator />
            </View>
        )
    }
}

const mapStateToProps = store => ({
    userInfo: store.userInfo,
})

const ConnectedAppNavigator = connect(mapStateToProps)(AppNavigatorContainer);

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
    };

    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            return (
                <ReduxProvider store={store}>
                    <PersistGate loading={<ActivityIndicator style={{ padding: 50 }} />} persistor={persistor}>
                        <PaperProvider theme={theme}>
                            <View style={styles.container}>
                                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                                <ConnectedAppNavigator />
                            </View>
                        </PaperProvider>
                    </PersistGate>
                </ReduxProvider>
            );
        }
    }

    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/snologo-dev.png'),
            ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
                // We include SpaceMono because we use it in HomeScreen.js. Feel free
                // to remove this if you are not using it in your app
                'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            }),
        ]);
    };

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

