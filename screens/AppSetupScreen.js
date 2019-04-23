import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { DangerZone, Permissions, Notifications, Constants } from 'expo';

const { Lottie } = DangerZone;
const { manifest } = Constants;

import { connect } from 'react-redux';
import { fetchArticles, fetchMenus } from '../redux/actions/actions';

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
    : `api.example.com`;


const PUSH_ENDPOINT = `http://${api}/token/add`;

class AppSetupScreen extends React.Component {

    componentDidMount() {
        if (this.animation) {
            this._playAnimation();
        }
        this._loadSettings();
    }

    componentDidUpdate() {
        const { menus, articlesByCategory, navigation } = this.props;
        if (menus.isLoaded) {
            
            if (articlesByCategory[menus.items[0].object_id] && !articlesByCategory[menus.items[0].object_id].isFetching) {
                console.log('finished loading menus and articles')
                
                navigation.navigate('MainApp');
            }
        }
    }

    render() {
        return (
            <View style={styles.rootContainer}>
                <View style={styles.animationContainer}>
                    <Lottie
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        loop={true}
                        speed={1}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/square-loader.json')}
                    />
                </View>
            </View>
        );
    }

    _loadSettings = async () => {
        const { url } = this.props.activeDomain;
        const { id } = this.props.activeDomain;
        //fetch menus
        this.props.dispatch(fetchMenus(url, id));
        this._registerForPushNotificationsAsync();
    };

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

    _registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }

        let token = await Notifications.getExpoPushTokenAsync();
        console.log('token', token, api)
        return fetch(PUSH_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              token
          }),
        });
      }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animationContainer: {
        width: 200,
        height: 200,
    },
})

const mapStateToProps = store => ({
    activeDomain: store.activeDomain,
    menus: store.menus,
    articlesByCategory: store.articlesByCategory
})

export default connect(mapStateToProps)(AppSetupScreen);