import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Animated,
    PanResponder
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Notifications } from 'expo';
import Color from 'color';
import { Provider as ReduxProvider, connect } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import { Provider as PaperProvider, Portal } from 'react-native-paper';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/configureStore';

import Sentry from 'sentry-expo';
import { secrets } from './env';

import { Feather } from '@expo/vector-icons';
import Moment from 'moment';

import { useScreens } from 'react-native-screens';

// performance optimization for navigations screens
// rendering bug -- commented out until fixed

// useScreens();

// sentry setup
// Sentry.enableInExpoDevelopment = true;

Sentry.config(secrets.SENTRYAPI).install();


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
                if (gestureState.dy < -40) {
                    this._hide();
                } else {
                    this._show();
                }
            }
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
                duration: 800,
                // useNativeDriver: true,
            }
        ).start();
    }

    _hide = () => {
        clearTimeout(this._hideTimeout);

        Animated.timing(this.state.slideAnim, {
            toValue: -125,
            duration: 400,
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
                                inputRange: [-125, 0],
                                outputRange: [0, 125],
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
        const { theme } = this.props;
        let primaryColor = Color(theme.colors.primary);
        let isDark = primaryColor.isDark();
        return (
            <View style={{ flex: 1 }}>
                <PaperProvider theme={theme}>
                    <View style={styles.container}>
                        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                        <AppNavigator screenProps={{ theme: theme }} />
                    </View>
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
                                backgroundColor: '#e0e0e0',
                                borderRadius: 10,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 0.37,
                                shadowRadius: 7.49,

                                elevation: 12,
                            }}
                        >
                            <Text style={{ fontSize: 10, paddingLeft: 10, color: '#424242' }}>
                                {String(Moment().fromNow())}
                            </Text>
                            <Text
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={{
                                    fontSize: 14,
                                    paddingHorizontal: 5,
                                }}
                            >
                                {notification.data ?
                                    `New ${notification.data.category_name} Story from ${notification.data.site_name}` :
                                    null
                                }
                            </Text>
                            <Text
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={{ fontSize: 14, paddingLeft: 10, color: '#757575' }}
                            >
                                {notification.data ?
                                    notification.data.title
                                    :
                                    null
                                }
                            </Text>
                        </FadeInView>
                    </Portal>
                </PaperProvider>
            </View>
        )
    }
}

const mapStateToProps = store => ({
    userInfo: store.userInfo,
    theme: store.theme
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
                    autoHideSplash={false}
                />
            );
        } else {
            return (
                <ReduxProvider store={store}>
                    <PersistGate loading={<ActivityIndicator style={{ padding: 50 }} />} persistor={persistor}>
                        <ConnectedAppNavigator />
                    </PersistGate>
                </ReduxProvider>
            );
        }
    }

    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/anon.png'),
                require('./assets/images/the-source-icon.png'),
                require('./assets/images/the-source-logo.png'),
                require('./assets/images/the-source-splash.png'),
            ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
            }),
        ]);
    };

    _handleLoadingError = error => {
        console.warn(error);
        Sentry.captureException(error)
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

