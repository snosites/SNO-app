import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';

const { Lottie } = DangerZone;

import Colors from '../constants/Colors'
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar, Badge, IconButton } from 'react-native-paper';

import {
    saveArticle,
    fetchArticlesIfNeeded,
    fetchMoreArticlesIfNeeded,
    invalidateArticles
} from '../redux/actions/actions';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';


// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color={Colors.tintColor} />
);

class ListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: navigation.getParam('menuTitle', 'Stories'),
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item title="menu" iconName="ios-menu" onPress={() => navigation.openDrawer()} />
                </HeaderButtons>
            ),
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
        snackbarVisible: false,
    }

    componentDidMount() {
        const { menus, navigation } = this.props;
        if (this.animation) {
            this._playAnimation();
        }
        navigation.setParams({
            headerLogo: menus.headerSmall
        })
    }

    componentDidUpdate() {
        if (this.animation) {
            this._playAnimation();
        }
    }

    render() {
        const { navigation, articlesByCategory, category } = this.props;
        const { snackbarVisible } = this.state;
        if (articlesByCategory.length === 0 && category.isFetching) {
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
                    data={articlesByCategory}
                    keyExtractor={item => item.id.toString()}
                    onEndReachedThreshold={0.25}
                    onEndReached={this._loadMore}
                    onRefresh={this._handleRefresh}
                    refreshing={category.didInvalidate}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    ListFooterComponent={() => {
                        if (!category.isFetching) {
                            return null
                        }
                        return (
                            <View style={styles.loadingMore}>
                                <ActivityIndicator />
                            </View>
                        )
                    }}
                    renderItem={(props) => {
                        const story = props.item;
                        return (
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this._handleArticlePress(story)}
                            >
                                <View style={styles.storyContainer}>
                                    {story.featuredImage ?
                                        <Image
                                            source={{ uri: story.featuredImage.uri }}
                                            style={styles.featuredImage}
                                        />
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
                                            <View style={{ flexDirection: 'row'}}>
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
                                                name='bookmark-border'
                                                color={Colors.tintColor}
                                                style={styles.socialIcon}
                                                size={24}
                                                onPress={() => {
                                                    this._handleArticleSave(story)
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        )
                    }}
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
                    Article Saved
                </Snackbar>
            </View>

        );
    }

    _handleArticlePress = article => async () => {
        console.log('in article press')
        const { navigation } = this.props;
        Haptic.selection();
        // check if there is a slidehsow
        if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
            article.slideshow = await this._getAttachmentsAync(article);
        }
        navigation.navigate('FullArticle', {
            articleId: article.id,
            article,
            commentNumber: article.comments.length,
            comments: article.comments
        })
    }

    _handleArticleSave = article => {
        console.log('in article save')
        this.props.dispatch(saveArticle(article))
        this.setState({
            snackbarVisible: true
        })
    }

    _loadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { activeDomain, category } = this.props;
            this.props.dispatch(fetchMoreArticlesIfNeeded({
                domain: activeDomain.url,
                category: category.categoryId,
            }))
            this.onEndReachedCalledDuringMomentum = true;
        }

    }

    _handleRefresh = () => {
        const { dispatch, activeDomain, category } = this.props;
        dispatch(invalidateArticles(category.categoryId));
        dispatch(fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        }))
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
        marginVertical: 10,
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
    imagePlaceholder: {
        backgroundColor: 'grey'
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
        fontSize: 14,
        color: 'grey'
    },
    author: {
        fontSize: 15,
        color: '#90caf9'
    },
    socialIcon: {
        paddingHorizontal: 5,
    },
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    }

});

const mapStateToProps = (state, ownProps) => {
    // gets category ID from navigation params or defaults to first item in the list
    const categoryId = ownProps.navigation.getParam('categoryId', state.menus.items[0].object_id);
    return {
        activeDomain: state.activeDomain,
        menus: state.menus,
        category: state.articlesByCategory[categoryId],
        articlesByCategory: state.articlesByCategory[categoryId].items.map(articleId => {
            return state.entities.articles[articleId]
        })
    }
}

export default connect(mapStateToProps)(ListScreen);