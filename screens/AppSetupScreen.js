import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Dimensions,
    Image
} from 'react-native';
import { DangerZone, Permissions, Notifications, Constants } from 'expo';

const { Lottie } = DangerZone;
const { manifest } = Constants;

import { connect } from 'react-redux';
import { fetchArticles, fetchMenus } from '../redux/actions/actions';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class AppSetupScreen extends React.Component {

    componentDidMount() {
        if (this.animation) {
            this._playAnimation();
        }
        this._loadSettings();
    }

    componentDidUpdate() {
        const { menus, articlesByCategory, navigation, errors } = this.props;
        if(errors.error == 'menu-saga error') {
            navigation.navigate('Error');
        }
        if (menus.isLoaded) {
            if (articlesByCategory[menus.items[0].object_id] && !articlesByCategory[menus.items[0].object_id].isFetching) {
                console.log('finished loading menus and articles')
                navigation.navigate('MainApp');
            }
        }
    }

    render() {
        const { menus } = this.props;
        if(menus.splashScreen) {
            return (
                    <Image
                        source={{ uri: menus.splashScreen }}
                        style={{ width: viewportWidth, height: viewportHeight }}
                        resizeMode='cover'
                    />
            )
        }
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
        const { url, id } = this.props.activeDomain;
        //fetch menus
        this.props.dispatch(fetchMenus(url, id));
    };

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

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
    articlesByCategory: store.articlesByCategory,
    userInfo: store.userInfo,
    errors: store.errors
})

export default connect(mapStateToProps)(AppSetupScreen);