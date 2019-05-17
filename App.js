import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Animated,
    PanResponder,
    TouchableOpacity
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Notifications } from 'expo';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { changeActiveDomain, setFromPush } from './redux/actions/actions';

import AppNavigator from './navigation/AppNavigator';
import NavigationService from './utils/NavigationService';
import { handleArticlePress } from './utils/articlePress';

import { Provider as PaperProvider, Portal } from 'react-native-paper';
import Color from 'color';
import Moment from 'moment';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/configureStore';

import Sentry from 'sentry-expo';
import { secrets } from './env';

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
            slideAnim: new Animated.Value(-125)
        }

        this._panResponder = PanResponder.create({
            // onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                //return true if user is swiping, return false if it's a single click
                const { dx, dy } = gestureState
                console.log('dy', dy, 'dx', dx)
                return dy > 2 || dy < -2
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                console.log('pan started', gestureState)
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

    // { "category_name": "Opinions", "domain_id": "59162841", "post_id": "34587", "site_name": "Best of SNO", "title": "test" }

    _handleNotification = (notification) => {
        console.log('new notification', notification);
        console.log('notification data', notification.data);
        this.setState({ notification });
        // if app is open show custom notification
        if (notification.origin === 'received') {
            this.setState({
                visible: true
            })
            setTimeout(() => {
                this.setState({
                    visible: false
                })
            }, 8000)
        }
        else if(notification.origin === 'selected') {
            this._handleNotificationPress();
        }
    };

    _handleNotificationPress = async () => {
        console.log('notification press')
        const { notification } = this.state;
        const { activeDomain, dispatch, domains } = this.props;
        this.setState({
            visible: false
        })
        NavigationService.navigate('FullArticle');
        const article = await this._fetchArticleAndComments(activeDomain.url, notification.data.post_id);
        if (notification.data.domain_id == activeDomain.id) {
            handleArticlePress(article, activeDomain);
        } else {
            // make sure domain origin is a saved domain
            let found = domains.find(domain => {
                return domain.id == notification.data.domain_id;
            })
            if(!found) {
                // user doesnt have this domain saved -- handle further later
                return;
            }
            // sets key for app to look for on new domain load
            dispatch(setFromPush(article));
            // change active domain
            dispatch(changeActiveDomain(notification.domain_id));
            //navigate to auth loading to load initial domain data
            NavigationService.navigate('AuthLoading');
        }
    }

    _fetchArticleAndComments = async (url, articleId) => {
        const [articleQuery, commentsQuery] = await Promise.all([
            await fetch(`https://${url}/wp-json/wp/v2/posts/${articleId}`),
            await fetch(`https://${url}/wp-json/wp/v2/comments?post=${articleId}`)
        ])
        const article = await articleQuery.json();
        const comments = await commentsQuery.json();
        article.comments = comments;
        return article;
    }

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
                        <AppNavigator 
                            screenProps={{ theme: theme }} 
                            ref={navigatorRef => {
                                NavigationService.setTopLevelNavigator(navigatorRef);
                            }}
                        />
                    </View>
                    <Portal>
                        <FadeInView
                            visible={true}
                            style={{
                                position: 'absolute',
                                top: -100,
                                right: 10,
                                left: 10,
                                height: 75,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                backgroundColor: '#e0e0e0',
                                borderRadius: 7,
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
                            <TouchableOpacity
                                style={{ 
                                    flex: 1,
                                    justifyContent: 'space-between', 
                                }}
                                onPress={() => this._handleNotificationPress()}
                            >
                                <Text style={{ fontSize: 10, paddingLeft: 5, color: '#424242' }}>
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
                                    style={{ fontSize: 14, paddingLeft: 5, color: '#757575' }}
                                >
                                    {notification.data ?
                                        notification.data.title
                                        :
                                        null
                                    }
                                </Text>
                            </TouchableOpacity>
                        </FadeInView>
                    </Portal>
                </PaperProvider>
            </View>
        )
    }
}

const mapStateToProps = store => ({
    userInfo: store.userInfo,
    theme: store.theme,
    activeDomain: store.activeDomain,
    domains: store.domains
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

