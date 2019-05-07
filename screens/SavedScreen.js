import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';

const { Lottie } = DangerZone;

import Colors from '../constants/Colors'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Snackbar, Badge } from 'react-native-paper';

import { removeSavedArticle } from '../redux/actions/actions';

class ListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Saved Stories',
            headerLeft: (
                logo &&
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 30, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='cover'
                />
            ),
            headerBackTitle: null
        };
    };

    state = {
        snackbarVisible: false
    }

    componentDidMount() {
        const { navigation, menus } = this.props;
        if (this.animation) {
            this._playAnimation();
        }
        navigation.setParams({
            headerLogo: menus.headerSmall
        })
    }

    componentDidUpdate() {
        console.log('in component did update saved')
        if (this.animation) {
            this._playAnimation();
        }
        const { navigation } = this.props;
        if (navigation.state.params && navigation.state.params.scrollToTop) {
            if (this.flatListRef) {
                // scroll list to top
                this._scrollToTop();
            }
            navigation.setParams({ scrollToTop: false })
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
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={savedArticles}
                    keyExtractor={item => item.id.toString()}
                    ref={(ref) => { this.flatListRef = ref; }}
                    renderItem={this._renderItem}
                />
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
            commentNumber: article.comments.length,
            comments: article.comments
        })
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }

    _handleArticleRemove = articleId => {
        console.log('in article remove')
        this.props.dispatch(removeSavedArticle(articleId))
        this.setState({
            snackbarVisible: true
        })
    }

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

    _renderItem = props => {
        const { theme } = this.props;
        const story = props.item;
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
                            baseFontStyle={{ fontSize: 17 }}
                            customWrapper={(text) => {
                                return (
                                    <Text ellipsizeMode='tail' numberOfLines={2}>{text}</Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: theme.dark ? 'white' : 'black'
                                }
                            }}
                        />
                        <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.author, { color: theme.colors.accent }]}>{story.custom_fields.writer ? story.custom_fields.writer : ''}</Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.date}>
                                    {Moment(story.date).format('D MMM YYYY')}
                                </Text>
                                <Text style={[{ paddingHorizontal: 5 }, styles.date]}>•</Text>
                                <Text style={styles.date}>{String(Moment(story.date).fromNow())}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ justifySelf: 'end', justifyContent: 'space-between' }}>
                        <View>
                            <FontAwesome name="comment"
                                size={21} color='#e0e0e0'
                            />
                            <Badge
                                size={16}
                                style={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 4,
                                    backgroundColor: theme.colors.accent,
                                    borderWidth: 1,
                                    borderColor: 'white'
                                }}
                            >
                                {story.comments.length}
                            </Badge>
                        </View>
                        <MaterialIcons
                            name='delete'
                            color='#c62828'
                            style={styles.socialIcon}
                            size={24}
                            onPress={() => {
                                this._handleArticleRemove(story.id)
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    date: {
        fontSize: 14,
        color: 'grey'
    },
    author: {
        fontSize: 15,
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
    theme: store.theme,
    menus: store.menus,
    savedArticles: store.savedArticles
})

export default connect(mapStateToProps)(ListScreen);