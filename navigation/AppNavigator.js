import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import { SplashScreen } from 'expo'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import AppStack from './AppStack';

import InitScreen from '../screens/InitScreen';
import SelectScreen from '../screens/SelectScreen';
import LocationSelect from '../screens/LocationSelect';
import ErrorBoundary from '../views/ErrorBoundary';

import { connect } from 'react-redux';
import { setActiveDomain, getApiKey } from '../redux/actionCreators';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const switchingDomain = this.props.navigation.getParam('switchingDomain', false);
        if(switchingDomain){
            return;
        }
        this._getDomainAsync();
    }

    componentDidUpdate() {
        const switchingDomain = this.props.navigation.getParam('switchingDomain', false);
        if (switchingDomain) {
            return;
        }
        this._getDomainAsync();
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator />
            </View>
        );
    }

    _getDomainAsync = async () => {
        const { dispatch, userInfo } = this.props;
        if(!userInfo.apiKey) {
            dispatch(getApiKey())
        }
        
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
            SplashScreen.hide();
            this.props.navigation.navigate('Auth')
        }
        
    };
}

const mapStateToProps = state => ({
    domains: state.domains,
    userInfo: state.userInfo
})


const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: SelectScreen,
    LocationSelect: LocationSelect

});

class CustomAppNavigator extends React.Component {
    static router = AppStack.router;
    render() {
        const { navigation, screenProps } = this.props;
        return (
            <ErrorBoundary navigation={navigation}>
                <AppStack navigation={navigation} screenProps={screenProps} />
            </ErrorBoundary>
        )
    }
}

export default AppContainer = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: connect(mapStateToProps)(AuthLoadingScreen),
        App: CustomAppNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));



