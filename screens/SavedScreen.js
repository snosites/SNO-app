import React from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';

const { Lottie } = DangerZone;

import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Snackbar, Badge } from 'react-native-paper';

import { removeSavedArticle } from '../redux/actions/actions';

class ListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Saved Stories',

        };
    };

    state = {
        snackbarVisible: false
    }

    componentDidMount() {
        if (this.animation) {
            this._playAnimation();
        }
    }

    componentDidUpdate() {
        if (this.animation) {
            this._playAnimation();
        }
    }

    render() {
        const { savedArticles } = this.props;
        const { snackbarVisible } = this.state;
        if (savedArticles === 'loading') {
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
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, marginVertical: 5 }}>
                    {savedArticles.map(story => {
                        return (
                            <TouchableOpacity
                                key={story.id}
                                onPress={this._handleArticlePress(story)}
                            >
                                <View style={styles.storyContainer}>
                                    {story.featuredImage ?
                                        <Image source={{ uri: story.featuredImage.uri }} style={styles.featuredImage} />
                                        :
                                        null
                                    }
                                    <View style={styles.storyInfo}>
                                        <HTML
                                            html={story.title.rendered}
                                            baseFontStyle={{ fontSize: 19 }}
                                            customWrapper={(text) => {
                                                return (
                                                    <Text ellipsizeMode='tail' numberOfLines={2}>{text}</Text>
                                                )
                                            }}
                                            tagsStyles={{
                                                rawtext: {
                                                    fontSize: 19,
                                                    fontWeight: 'bold'
                                                }
                                            }}
                                        />
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.author}>{story.custom_fields.writer ? story.custom_fields.writer : 'Unknown'}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            paddingTop: 5,
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.date}>
                                                    {Moment(story.date).format('D MMM YYYY')}
                                                </Text>
                                                <Text style={[{ paddingHorizontal: 10 }, styles.date]}>•</Text>
                                                <Text style={styles.date}>{String(Moment(story.date).fromNow())}</Text>
                                                <View style={{
                                                    marginHorizontal: 15,
                                                }}>
                                                    <FontAwesome name="comment"
                                                        size={21} color='grey'
                                                    />
                                                    <Badge
                                                        size={16}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 2,
                                                            right: -10,
                                                            backgroundColor: '#4fc3f7',
                                                            borderWidth: 1,
                                                            borderColor: 'white'
                                                        }}
                                                    >
                                                        {story.comments.length}
                                                    </Badge>
                                                </View>
                                            </View>
                                            <MaterialIcons
                                                onPress={() => {
                                                    this._handleArticleRemove(story.id)
                                                }}
                                                style={styles.socialIcon} name='delete'
                                                size={24}
                                                color={'#c62828'}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <Snackbar
                    visible={snackbarVisible}
                    style={styles.snackbar}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarVisible: false })
                        }
                    }}
                >
                    Article Removed
                </Snackbar>
            </View>

        );
    }

    _handleArticlePress = article => async () => {
        const { navigation } = this.props;
        Haptic.selection();
        // check if there is a slidehsow
        if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
            article.slideshow = await this._getAttachmentsAync(article);
        }
        navigation.push('FullArticle', {
            articleId: article.id,
            article,
        })
    }

    _handleArticleRemove = articleId => {
        console.log('in article remove')
        this.props.dispatch(removeSavedArticle(articleId))
        this.setState({
            snackbarVisible: true
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
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
});

const mapStateToProps = store => ({
    savedArticles: store.savedArticles
})

export default connect(mapStateToProps)(ListScreen);