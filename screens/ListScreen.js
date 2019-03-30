import React from 'react';
import {
    Platform,
    AsyncStorage,
    View,
    ScrollView,
    Text,
    Image,
    ActivityIndicator
} from 'react-native';
import { createDrawerNavigator, createStackNavigator, NavigationEvents } from 'react-navigation';

import TouchableItem from '../constants/TouchableItem';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

import { Card, ListItem, Button, Icon } from 'react-native-elements'

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
        const { navigation } = this.props;
        if (!navigation.state.params) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color='blue' />
                </View>
            )
        }
        // console.log('render in params', navigation.state.params.content)
        return (
            <ScrollView>
                {navigation.state.params.content.map((story, i) => {
                    return (
                        <Card
                            key={story.id}
                            title={story.title.rendered}
                        // image={require('../images/pic2.jpg')}
                        >
                            <Text style={{ marginBottom: 10 }}>
                                {story.excerpt.rendered}
                            </Text>
                            <Button
                                icon={<Icon name='code' color='#ffffff' />}
                                backgroundColor='#03A9F4'
                                buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                title='Read More' />
                        </Card>
                    )
                })}
            </ScrollView>
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