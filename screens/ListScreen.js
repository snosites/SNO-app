import React from 'react';
import {
    Platform,
    AsyncStorage,
    View,
    ScrollView,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import Colors from '../constants/Colors'
import TouchableItem from '../constants/TouchableItem';

import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

import { Haptic, DangerZone } from 'expo';

const { Lottie } = DangerZone;

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color={Colors.tintColor} />
);

export default class ListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('menuTitle', 'Stories'),
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item title="menu" iconName="ios-menu" onPress={() => navigation.openDrawer()} />
                </HeaderButtons>
            ),
        };
    };

    componentDidMount(){
        if(this.animation){
            this._playAnimation();
        }
    }

    componentDidUpdate(){
        if(this.animation){
            this._playAnimation();
        }
    }

    render() {
        const { navigation } = this.props;
        let stories = navigation.getParam('content', 'loading')
        if (stories === 'loading') {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
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
                            source={require('../assets/lottiefiles/article-loading-animation')}
                        />
                    </View>
                </View>
            )
        }
        return (
            <ScrollView style={{ flex: 1, marginVertical: 5 }}>
                {stories.map(story => {
                    return (
                        <TouchableOpacity
                            key={story.id}
                            onPress={this._handleArticlePress(story)}
                        >
                            <View style={styles.storyContainer}>
                                <Image source={{ uri: story.featuredImage.uri }} style={styles.featuredImage} />
                                <View style={styles.storyInfo}>
                                    <Text ellipsizeMode='tail' numberOfLines={2} style={styles.title}>{story.title.rendered}</Text>
                                    <View style={styles.extraInfo}>
                                        <View style={{flex: 1}}>
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.author}>{story.custom_fields.writer ? story.custom_fields.writer : 'Unknown'}</Text>
                                        <Text style={styles.date}>{Moment(story.modified).fromNow()}</Text>
                                        </View>
                                        
                                        <View style={styles.socialIconsContainer}>

                                            <MaterialIcons onPress={() => {
                                                alert('share')
                                            }} style={styles.socialIcon} name='share' size={28} color={Colors.tintColor} />
                                            <MaterialIcons style={styles.socialIcon} name='bookmark-border' size={28} color={Colors.tintColor} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        );
    }


    _handleArticlePress = article => async () => {
        const { navigation } = this.props;
        Haptic.selection();
        // check if there is a slidehsow
        if(article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images'){
            article.slideshow = await this._getAttachmentsAync(article);
        }
        navigation.push('FullArticle', {
            articleId: article.id,
            article,
        })
    }

    _getAttachmentsAync = async (article) => {
        const response = await fetch(article._links['wp:attachment'][0].href);
        const imageAttachments = await response.json();
        return imageAttachments;
    }

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };
}

const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 15,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    featuredImage: {
        width: 125,
        height: 90,
        borderRadius: 8
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    extraInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flex: 1,
    },
    socialIconsContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 15,
        color: 'grey'
    },
    author: {
        fontSize: 15,
        color: '#90caf9'
    },
    socialIcon: {
        paddingHorizontal: 5
    },

});