import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Notifications, WebBrowser, Constants } from 'expo';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { changeActiveDomain, setFromPush } from './redux/actionCreators';

import AppNavigator from './navigation/AppNavigator';
import NavigationService from './utils/NavigationService';

import { handleArticlePress } from './utils/articlePress';
import { asyncFetchFeaturedImage, asyncFetchComments } from './utils/sagaHelpers';
import FadeInView from './views/FadeInView';

import { Provider as PaperProvider, Portal } from 'react-native-paper';
import Color from 'color';
import Moment from 'moment';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/configureStore';
import ErrorBoundary from './views/ErrorBoundary';

import Sentry from 'sentry-expo';
import { Amplitude } from 'expo';

import { secrets } from './env';

// import { useScreens } from 'react-native-screens';

// performance optimization for navigations screens
// rendering bug -- commented out until fixed

// useScreens();



//set config based on version
let amplitudeKey = '';
if(Constants.manifest.releaseChannel === 'sns') {
    amplitudeKey = Constants.manifest.extra.highSchool.amplitudeKey;
} else if (Constants.manifest.releaseChannel === 'cns') {
    amplitudeKey = Constants.manifest.extra.college.amplitudeKey;
} else {
    amplitudeKey = secrets.AMPLITUDEAPI;
}

console.log('amplitude key', amplitudeKey);
Amplitude.initialize(amplitudeKey);


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
            }, 7000)
        }
        else if (notification.origin === 'selected') {
            this._handleNotificationPress();
        }
    };


    _handleNotificationPress = async () => {
        try {
            const { notification } = this.state;
            const { activeDomain, domains } = this.props;
            console.log('notification press')
            // send analytics data
            Amplitude.logEventWithProperties('notification press', {
                domainId: notification.data.domain_id,
                storyId: notification.data.post_id
            })

            this.setState({
                visible: false
            })
            if(notification.data.link){
                this._viewLink(notification.data.link);
                return;
            }
            // if the push is from active domain go to article
            if (notification.data.domain_id == activeDomain.id) {
                // get article
                const article = await this._fetchArticle(activeDomain.url, notification.data.post_id);
                // get featured image if there is one
                if (article._links['wp:featuredmedia']) {
                    await asyncFetchFeaturedImage(`${article._links['wp:featuredmedia'][0].href}`, article)
                }
                // get comments
                await asyncFetchComments(activeDomain.url, article)
                handleArticlePress(article, activeDomain);
            } else {
                // make sure domain origin is a saved domain
                let found = domains.find(domain => {
                    return domain.id == notification.data.domain_id;
                })
                console.log('found', found)
                if (!found) {
                    // user doesnt have this domain saved so dont direct anywhere -- if this happens it would be a bug
                    return;
                }
                Alert.alert(
                    'Switch Active School?',
                    `Viewing this story will switch your active school to ${notification.data.site_name}.`,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel'
                        },
                        {
                            text: 'Proceed',
                            onPress: () => {
                                this._notificationSwitchDomain(found.url);
                            }
                        }
                    ],
                    { cancelable: false },
                )
            }
        } catch (err) {
            console.log('error in notification press', err)
            Sentry.captureException(err)
        }
    }

    _notificationSwitchDomain = async (url) => {
        console.log('switching domain');
        try {
            const { notification } = this.state;
            const { dispatch } = this.props;
            NavigationService.navigate('AuthLoading', {
                switchingDomain: true
            });
            // get article
            const article = await this._fetchArticle(url, notification.data.post_id);
            // get featured image if there is one
            if (article._links['wp:featuredmedia']) {
                await asyncFetchFeaturedImage(`${article._links['wp:featuredmedia'][0].href}`, article)
            }
            // get comments
            await asyncFetchComments(url, article)
            // sets key for app to look for on new domain load
            dispatch(setFromPush(article));
            // change active domain
            console.log('notification.data.domain_id', notification.data, notification.data.domain_id)
            dispatch(changeActiveDomain(Number(notification.data.domain_id)));
            //navigate to auth loading to load initial domain data
            let nav = NavigationService;
            nav.navigate('AuthLoading', {
                switchingDomain: false
            });
        } catch (err) {
            console.log('error in notification switch domain func', err)
            NavigationService.navigate('HomeStack');
            Sentry.captureException(err)
        }
    }

    _fetchArticle = async (url, articleId) => {
        try {
            const result = await fetch(`https://${url}/wp-json/wp/v2/posts/${articleId}`)
            const article = await result.json();
            if (result.status != 200) {
                throw new Error('error getting article from push')
            }
            return article;
        } catch (err) {
            console.log('error getting article', err);
            Sentry.captureException(err);
            // NavigationService.navigate('HomeStack');
            throw err
        }
    }

    _viewLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
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
                            visible={visible}
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
                // This is the font for our tab bar
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

