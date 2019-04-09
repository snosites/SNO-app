import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { DangerZone } from 'expo';

const { Lottie } = DangerZone;

import { connect } from 'react-redux';
import { fetchArticles } from '../redux/actions/actions';



class AppSetupScreen extends React.Component {

    componentDidMount() {
        if (this.animation) {
            this._playAnimation();
        }
        this._loadSettings();
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
                                width: 400,
                                height: 400,
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
        const activeDomain = this.props.domains.filter(domain => {
            if(domain.active){
                return domain
            }
        })
        // sets active domain for app and then navigates to app
        if(activeDomain.length > 0) {
            this.props.dispatch(setActiveDomain(activeDomain[0]))
            this.props.navigation.navigate('App')
        }
        // no active domain navigate to auth
        else {
            this.props.navigation.navigate('Auth')
        }
        
    };

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1, 
        justifyContent: 'center' 
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
})

const mapStateToProps = store => ({
    activeDomain: store.activeDomain
})

export default connect()(AppSetupScreen);