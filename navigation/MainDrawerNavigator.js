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

import TouchableItem from '../constants/TouchableItem';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import DrawerNavIcon from '../components/DrawerNavIcon';

import CustomDrawer from './CustomDrawer';
import ListScreen from '../screens/ListScreen';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color="blue" />
);


class FullArticleScreen extends React.Component {
    static navigationOptions = {
        title: 'FullArticleScreen',
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back to List Screen"
            />
        );
    }
}

const ArticleStack = createStackNavigator({
    List: ListScreen,
    FullArticle: FullArticleScreen,
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
        }, 2000)
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