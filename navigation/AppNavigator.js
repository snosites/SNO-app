import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator, NavigationActions } from 'react-navigation';

import AppStack from './AppStack';

import InitScreen from '../screens/InitScreen';
import SelectScreen from '../screens/SelectScreen';

import { connect } from 'react-redux';
import { setActiveDomain } from '../redux/actions/actions';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._getDomainAsync();
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" />
            </View>
        );
    }

    _getDomainAsync = async () => {
        console.log('in get dom async')
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
}

const mapStateToProps = state => ({
    domains: state.domains
})


const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: connect(mapStateToProps)(SelectScreen)
});

const AppContainer = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: connect(mapStateToProps)(AuthLoadingScreen),
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));



export default AppContainer;