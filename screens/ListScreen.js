import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import Moment from 'moment';
import Color from 'color';
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
    invalidateArticles,
    removeSavedArticle
} from '../redux/actions/actions';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';


// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color={Colors.tintColor} />
);

class ListScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { theme } = screenProps;
        const logo = navigation.getParam('headerLogo', null)
        let primaryColor = Color(theme.colors.primary);
        let isDark = primaryColor.isDark();
        return {
            title: navigation.getParam('menuTitle', 'Stories'),
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item
                        title="menu"
                        iconName="ios-menu"
                        buttonStyle={{ color: isDark ? 'white' : 'black' }}
                        onPress={() => navigation.openDrawer()} />
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
        snackbarSavedVisible: false,
        snackbarRemovedVisible: false
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
        console.log('in component did update list')
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
        const { navigation, articlesByCategory, category, theme } = this.props;
        const { snackbarSavedVisible, snackbarRemovedVisible } = this.state;
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
        if (category.error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.animationContainerError}>
                        <Lottie
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: 200,
                                height: 200,
                            }}
                            loop={false}
                            speed={1}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/broken-stick-error')}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                        Sorry, something went wrong.
                    </Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={articlesByCategory}
                    keyExtractor={item => item.id.toString()}
                    ref={(ref) => { this.flatListRef = ref; }}
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
                                                {this._renderDate(story.date)}
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
                                                }}
                                            >
                                                {story.comments.length > 99 ? '99' : story.comments.length}
                                            </Badge>
                                        </View>
                                        <MaterialIcons
                                            name={
                                                story.saved ? 'bookmark'
                                                    :
                                                    'bookmark-border'
                                            }
                                            color={theme.colors.accent}
                                            style={styles.socialIcon}
                                            size={24}
                                            onPress={() => {
                                                this._saveRemoveToggle(story)
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                        )
                    }}
                />
                <Snackbar
                    visible={snackbarSavedVisible}
                    style={styles.snackbar}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarSavedVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarSavedVisible: false })
                        }
                    }}
                >
                    Article Added To Saved List
                </Snackbar>
                <Snackbar
                    visible={snackbarRemovedVisible}
                    style={styles.snackbar}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarRemovedVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarRemovedVisible: false })
                        }
                    }}
                >
                    Article Removed From Saved List
                </Snackbar>
            </View>

        );
    }

    _getAttachmentsAync = async (article) => {
        console.log('article', article)
        const response = await fetch(article._links['wp:attachment'][0].href);
        const imageAttachments = await response.json();
        return imageAttachments;
    }

    _handleArticlePress = article => () => {
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
        console.log('article', article)
        if(article.custom_fields.sno_format && article.custom_fields.sno_format == 'Classic') {
            this._handleRegularArticle(article)
        } else {
            this._handleLongFormArticle(article);
        }
    }

    _handleRegularArticle = async (article) => {
        console.log('in article press')
        const { navigation } = this.props;
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
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

    _handleLongFormArticle = async article => {
        console.log('in article press long form')
        const { navigation, activeDomain } = this.props;
        let storyChapters = [];
        if (article.custom_fields.sno_format == "Long-Form") {
            let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_longform_list&meta_query[0][value]=${article.id}`)
            storyChapters = await results.json();
        }
        else if (article.custom_fields.sno_format == "Grid") {
            let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_grid_list&meta_query[0][value]=${article.id}`)
            storyChapters = await results.json();
        }
        else if (article.custom_fields.sno_format == "Side by Side") {
            let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_sidebyside_list&meta_query[0][value]=${article.id}`)
            storyChapters = await results.json();
        }
        let updatedStoryChapters = await Promise.all(storyChapters.map(async article => {
            const response = await fetch(`https://${activeDomain.url}/wp-json/wp/v2/posts/${article.ID}`)
            return await response.json();
        }))
        updatedStoryChapters = await Promise.all(updatedStoryChapters.map(async article => {
            if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
                article.slideshow = await this._getAttachmentsAync(article);
            }
            if (article._links['wp:featuredmedia']) {
                const imgResponse = await fetch(article._links['wp:featuredmedia'][0].href);
                const featuredImage = await imgResponse.json();
                if (!featuredImage.meta_fields) {
                    article.featuredImage = {
                        uri: featuredImage.source_url,
                        photographer: 'Unknown',
                        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
                    }
                    return article
                }
                article.featuredImage = {
                    uri: featuredImage.source_url,
                    photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
                    caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
                }
            } 
            return article
        }))
        if (article.custom_fields.sno_format == "Long-Form") {
            console.log('updated chapters', updatedStoryChapters)
            updatedStoryChapters.sort(function (a, b) {
                if (a.custom_fields.sno_longform_order && a.custom_fields.sno_longform_order[0] < b.custom_fields.sno_longform_order && b.custom_fields.sno_longform_order[0])
                    return -1;
                if (a.custom_fields.sno_longform_order && a.custom_fields.sno_longform_order[0] > b.custom_fields.sno_longform_order && b.custom_fields.sno_longform_order[0])
                    return 1;
                return 0;
            })
        }
        navigation.navigate('FullArticle', {
            articleId: article.id,
            article,
            articleChapters: updatedStoryChapters,
            commentNumber: article.comments.length,
            comments: article.comments
        })
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }

    _saveRemoveToggle = article => {
        if (article.saved) {
            this._handleArticleRemove(article.id);
        } else {
            this._handleArticleSave(article);
        }
    }

    _handleArticleSave = article => {
        
        const { activeDomain } = this.props;
        console.log('in article save', activeDomain)
        this.props.dispatch(saveArticle(article, activeDomain.id))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        console.log('in article remove')
        const { activeDomain } = this.props;
        this.props.dispatch(removeSavedArticle(articleId, activeDomain.id))
        this.setState({
            snackbarRemovedVisible: true
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

    _renderDate = date => {
        let dateNow = Moment();
        let subDate = Moment(date).subtract(7, 'days');
        console.log('moment date', subDate, dateNow)
        if (Moment().isAfter(Moment(date).add(7, 'days'))) {
            return (
                <Text style={{
                    fontSize: 15,
                    color: '#9e9e9e'
                }}
                >
                    {Moment(date).format('MMM D YYYY')}
                </Text>
            )
        } else {
            return (
                <Text style={{
                    fontSize: 15,
                    color: '#9e9e9e'
                }}
                >
                    {String(Moment(date).fromNow())}
                </Text>
            )
        }
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
    animationContainerError: {
        width: 200,
        height: 200,
    },
    featuredImage: {
        width: 125,
        height: 80,
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
    date: {
        fontSize: 14,
        color: 'grey'
    },
    author: {
        fontSize: 15
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
        theme: state.theme,
        activeDomain: state.activeDomain,
        menus: state.menus,
        category: state.articlesByCategory[categoryId],
        articlesByCategory: state.articlesByCategory[categoryId].items.map(articleId => {
            const found = state.savedArticlesBySchool[state.activeDomain.id].find(savedArticle => {
                return savedArticle.id == articleId;
            })
            if (found) {
                state.entities.articles[articleId].saved = true;
            } else {
                state.entities.articles[articleId].saved = false;
            }
            return state.entities.articles[articleId]
        })
    }
}

export default connect(mapStateToProps)(ListScreen);