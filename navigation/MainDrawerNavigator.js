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

import TabBarIcon from '../components/TabBarIcon';

import CustomDrawer from './CustomDrawer';
import ListScreen from '../screens/ListScreen';
import FullArticleScreen from '../screens/FullArticleScreen';
import ProfileScreen from '../screens/ProfileScreen';

import CommentsScreen from '../screens/CommentsScreen';





const ArticleStack = createStackNavigator({
    List: ListScreen,
    FullArticle: FullArticleScreen,
    Profile: ProfileScreen,
    Comments: CommentsScreen
},);


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
        contentComponent: CustomDrawer
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