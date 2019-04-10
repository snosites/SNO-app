import React from 'react';
import {
    Platform,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView, createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import TabBarIcon from '../components/TabBarIcon';

import CustomDrawer from './CustomDrawer';
import ListScreen from '../screens/ListScreen';
import FullArticleScreen from '../screens/FullArticleScreen';
import ProfileScreen from '../screens/ProfileScreen';

// import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

// // header icon native look component
// const IoniconsHeaderButton = passMeFurther => (
//     <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color="blue" />
// );

const mapStateToProps = state => ({
    activeDomain: state.activeDomain,
    
})

const ArticleStack = createStackNavigator({
    List: connect()(ListScreen),
    FullArticle: FullArticleScreen,
    Profile: connect(mapStateToProps)(ProfileScreen)
});

ArticleStack.navigationOptions = {

};

class HomeLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loadingSettings: true
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({loadingSettings: false})
            this.props.navigation.navigate('HomeMain');
        }, 100)
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center'}}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color='purple' />
            </View>
        );
    }
}




const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: ArticleStack,
    },
    {
        contentComponent: connect(mapStateToProps)(CustomDrawer)
    }
);

MyDrawerNavigator.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-home`
                    : 'md-home'
            }
        />
    ),
};

const HomeLoadingStack = createSwitchNavigator({
    HomeLoading: HomeLoadingScreen,
    HomeMain: MyDrawerNavigator
})

HomeLoadingStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-home`
                    : 'md-home'
            }
        />
    ),
};


export default HomeLoadingStack;