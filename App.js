import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ActivityIndicator, Animated, PanResponder } from 'react-native';
import { AppLoading, Asset, Font, Icon, Notifications } from 'expo';

import { Provider as ReduxProvider, connect } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import { Provider as PaperProvider, DefaultTheme, Colors, Snackbar, Portal } from 'react-native-paper';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/configureStore';

import Sentry from 'sentry-expo';
import { secrets } from './env';

import { Feather } from '@expo/vector-icons';
import Moment from 'moment';

// Remove this once Sentry is correctly setup.
// Sentry.enableInExpoDevelopment = true;

Sentry.config(secrets.SENTRYAPI).install();


const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.blue500,
        accent: Colors.blue800,
    }
};

class FadeInView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slideAnim: new Animated.Value(-170)
        }

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                console.log('pan started')
            },
            // on each move event, set slideValue to gestureState.dx -- the 
            // first value `null` ignores the first `event` argument
            onPanResponderMove: Animated.event([
                null, {
                    dy: this.state.slideAnim
                }
            ]),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy < -60) {
                    this._hide();
                } else {
                    this._show();
                }

            }
            // onPanResponderMove: (evt, gestureState) => [
            //     console.log('gesture', gestureState.dx, gestureState.dy)
            // ]

            // ...rest of your panResponder handlers
        });
    }


    componentDidMount() {

        if (this.props.visible) {
            this._show();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this._toggle();
        }
    }

    _toggle = () => {
        if (this.props.visible) {
            this._show();
        } else {
            this._hide();
        }
    };

    _show = () => {
        Animated.timing(
            this.state.slideAnim,
            {
                toValue: 0,
                duration: 300,
                // useNativeDriver: true,
            }
        ).start();
    }

    _hide = () => {
        clearTimeout(this._hideTimeout);

        Animated.timing(this.state.slideAnim, {
            toValue: -170,
            duration: 300,
            // useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                //
            }
        });
    }



    render() {
        let { slideAnim } = this.state;

        return (
            <Animated.View
                {...this._panResponder.panHandlers}
                style={{
                    ...this.props.style,
                    // opacity: this.state.slideAnim,
                    transform: [
                        {
                            // translateY: slideAnim
                            translateY: slideAnim.interpolate({
                                inputRange: [-170, 0],
                                outputRange: [0, 170],
                                extrapolateRight: 'clamp'
                            }),
                        },
                        { perspective: 1000 },
                    ]
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

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
        console.log('new notification', notification);
        console.log('notification data', notification.data);
        this.setState({ notification });

        if (notification.origin == 'received') {
            this.setState({
                visible: true
            })
            setTimeout(() => {
                this.setState({
                    visible: false
                })
            }, 8000)
        }
    };

    render() {
        const { notification, visible } = this.state;
        return (
            <View style={{ flex: 1 }}>

                <Portal>
                    <FadeInView
                        visible={visible}
                        style={{
                            position: 'absolute',
                            top: -100,
                            right: 10,
                            left: 10,
                            height: 75,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            justifyContent: 'space-between',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.23,
                            shadowRadius: 2.62,

                            elevation: 4,
                        }}
                    >
                        <Text style={{ fontSize: 10, paddingLeft: 20, color: '#9e9e9e' }}>
                            {String(Moment().fromNow())}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="award" size={14} color="#ffca28" />
                            <Text
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={{
                                    fontSize: 14,
                                    paddingHorizontal: 5,
                                    color: '#757575'
                                }}
                            >
                                {notification.data ?
                                    `New ${notification.data.category_name} Story from ${notification.data.site_name}` :
                                    null
                                }
                            </Text>
                        </View>
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{ fontSize: 17, paddingLeft: 20 }}
                        >
                            {notification.data ?
                                notification.data.title
                                :
                                null
                            }
                        </Text>
                    </FadeInView>
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

