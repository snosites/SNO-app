import React from 'react';
import {
    Platform,
    AsyncStorage,
    View,
    ScrollView,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import Moment from 'moment';

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
        let stories = navigation.getParam('content', 'loading')
        console.log('stories', stories)
        console.log('render in params', navigation.state)
        if (stories === 'loading') {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color='blue' />
                </View>
            )
        }
        return (
            <ScrollView style={{flex: 1, marginVertical: 5}}>
                {stories.map(story => {
                    console.log('story title', story.title.rendered)
                    return (
                        <View key={story.id} style={styles.storyContainer}>
                            <Image source={{uri: story.featuredImage}} style={styles.featuredImage} />
                            <View style={styles.storyInfo}>
                                <Text ellipsizeMode='tail' numberOfLines={2}style={styles.title}>{story.title.rendered}</Text>
                                <Text style={styles.date}>{Moment(story.modified).fromNow()}</Text>
                            </View>
                        </View>
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

const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 15
    },
    featuredImage: {
        width: 125,
        height: 90,
        borderRadius: 15
    },
    storyInfo: {
        flex: 1, 
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 15,
        color: 'grey'
    }
});