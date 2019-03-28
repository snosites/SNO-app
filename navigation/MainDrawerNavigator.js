import React from 'react';
import {
    Image,
    Platform,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    AsyncStorage
} from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';

import { Feather } from '@expo/vector-icons';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';



class MyHomeScreen extends React.Component {
    static navigationOptions = {
        title: 'testing home',
        
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.navigate('Links')}
                title="Go to notifications"
            />
        );
    }
}

class MyNotificationsScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
        drawerIcon: ({ tintColor }) => (
            <Feather name="menu" size={24} color={tintColor} />
        ),
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }
}

const LinksStack = createStackNavigator({
    Home: MyHomeScreen,
    Links: LinksScreen,
  });
  
LinksStack.navigationOptions = {
    drawerLabel: 'Breaking News',
    drawerIcon: ({ tintColor }) => (
        <Feather name="menu" size={24} color={tintColor} />
    ),
};

const MyDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: LinksStack,
    },
    Notifications: {
        screen: MyNotificationsScreen,
    },
},
{
    contentOptions: {
        labelStyle: {fontSize: 19}
    },
    contentComponent: <CustomDrawerContent />
});

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

export default MyDrawerNavigator;