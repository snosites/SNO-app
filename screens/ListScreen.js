import React from 'react';
import {
    Platform,
    Button,
    AsyncStorage,
    View,
    Text
} from 'react-native';
import { createDrawerNavigator, createStackNavigator, NavigationEvents } from 'react-navigation';

import TouchableItem from '../constants/TouchableItem';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color="blue" />
);

export default class ListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('menuTitle', 'Stories'),
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item title="search" iconName="ios-menu" onPress={() => navigation.openDrawer()} />
                </HeaderButtons>
            ),
        };
    };

    render() {
        if(this.props.navigation.state.params){
            console.log('render in params', this.props.navigation.state.params.content.length)
        }
        
        return (
            <View>
                <NavigationEvents
                    onDidFocus={payload => console.log('did focus',payload, this.props.navigation.state.params)}
                />
                <Text></Text>
                <Button
                onPress={() => this.props.navigation.navigate('FullArticle')}
                title="Go to Full Article Screen"
            />
            </View>
        );
    }

    _fetchCategoryStories = async () => {
        console.log('in fetchcatstories', this.props.navigation.getParam('categoryId'))
        try {
            const userDomain = await AsyncStorage.getItem('userDomain');
            const response = await fetch(`${userDomain}/wp-json/wp/v2/posts?categories=${this.props.navigation.getParam('categoryId')}`)
            const stories = await response.json();
            console.log('results', stories)
        }
        catch (error) {
            console.log('error saving users org', error)
        }
    }
}