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
        const { userInfo } = this.props;
        const { url } = this.props.activeDomain;
        const { id } = this.props.activeDomain;
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
    userInfo: store.userInfo
})

export default connect(mapStateToProps)(AppSetupScreen);