import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Dimensions,
    Image,
    ImageBackground
} from 'react-native';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

import { connect } from 'react-redux';
import { initialize, setFromPush } from '../redux/actions/actions';
import { handleArticlePress } from '../utils/articlePress';
import anim from '../assets/lottiefiles/splash-animation';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const ANIMATION_WIDTH = viewportWidth;
const ANIMATION_BOTTOM_PADDING = viewportHeight * 0.20;

class AppSetupScreen extends React.Component {

    componentDidMount() {
        if (this.animation) {
            this.animation.play();
        }
        this._loadSettings();
    }

    componentDidUpdate() {
        const { activeDomain, menus, articlesByCategory, navigation, errors, userInfo, dispatch } = this.props;
        if (errors.error == 'initialize-saga error' || errors.error == 'menu-saga error') {
            navigation.navigate('Error', {
                errorMessage: 'Sorry, this school is currently unavailable'
            });
        }
        if (errors.error == 'no school') {
            navigation.navigate('Error', {
                errorMessage: 'Sorry, this school did not renew its Student News Source subscription'
            });
        }
        if (this.animation) {
            console.log('animation found');
            this.animation.play();
        }
        // if (menus.isLoaded) {
        //     if (articlesByCategory[menus.items[0].object_id] && !articlesByCategory[menus.items[0].object_id].isFetching) {
        //         // check if the user is coming from a push notification
        //         if(userInfo.fromPush) {
        //             // go to main app
        //             navigation.navigate('MainApp');
        //             // direct to article from push
        //             handleArticlePress(userInfo.fromPush, activeDomain);
        //             // reset push key
        //             dispatch(setFromPush(false));

        //         }
        //         console.log('finished loading menus and articles')
        //         navigation.navigate('MainApp');
        //     }
        // }
    }

    render() {
        const { menus } = this.props;
        // if(menus.splashScreen) {
        //     return (
        //             <Image
        //                 source={{ uri: menus.splashScreen }}
        //                 style={{ width: viewportWidth, height: viewportHeight }}
        //                 resizeMode='cover'
        //             />
        //     )
        // }
        return (
            <View style={{
                flex: 1
            }}>
                <ImageBackground
                    source={require('../assets/images/the-source-splash.png')}
                    resizeMode='cover'
                    style={{
                        width: viewportWidth,
                        height: viewportHeight,
                        flex: 1
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: viewportWidth,
                            height: viewportHeight,
                            paddingBottom: ANIMATION_BOTTOM_PADDING,
                        }}
                    >
                    <View>
                            <Lottie
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                resizeMode="cover"
                                style={{
                                    width: ANIMATION_WIDTH,
                                    height: 100,
                                }}
                                loop={true}
                                speed={0.75}
                                autoPlay={true}
                                source={anim}
                            />
                    </View>
                        
                    </View>
                </ImageBackground>
            </View>
        );
    }

    _loadSettings = async () => {
        const { url, id } = this.props.activeDomain;
        //fetch menus
        this.props.dispatch(initialize(url, id));
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