import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import Moment from 'moment';
import Color from 'color';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';
const { Lottie } = DangerZone;

import Colors from '../constants/Colors'
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Snackbar, Badge } from 'react-native-paper';

import {
    saveArticle,
    removeSavedArticle,
    fetchSearchArticlesIfNeeded,
    fetchMoreSearchArticlesIfNeeded,
    invalidateSearchArticles
} from '../redux/actions/actions';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color={Colors.tintColor} />
);

class SearchScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { theme } = screenProps;
        const logo = navigation.getParam('headerLogo', null)
        let primaryColor = Color(theme.colors.primary);
        let isDark = primaryColor.isDark();
        return {
            title: 'Search Results',
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item
                        title="menu"
                        iconName="ios-menu"
                        buttonStyle={{ color: isDark ? 'white' : 'black' }}
                        onPress={() => { navigation.openDrawer() }} />
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
        const { dispatch, activeDomain, navigation, menus, theme } = this.props;
        const searchTerm = navigation.getParam('searchTerm', null);
        if (this.animation) {
            this._playAnimation();
        }
        navigation.setParams({
            headerLogo: menus.headerSmall
        })
    }

    componentDidUpdate() {
        console.log('in component did update recent')
        if (this.animation) {
            this._playAnimation();
        }
        const { navigation } = this.props;
        // if (navigation.state.params && navigation.state.params.scrollToTop) {
        //     if (this.flatListRef) {
        //         // scroll list to top
        //         this._scrollToTop();
        //     }
        //     navigation.setParams({ scrollToTop: false })
        // }
    }


    render() {
        const { navigation, searchArticles, search, theme } = this.props;
        const { snackbarSavedVisible, snackbarRemovedVisible } = this.state;

        if (search.didInvalidate === true && search.isFetching) {
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
                            source={require('../assets/lottiefiles/search-processing')}
                        />
                    </View>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={searchArticles}
                    keyExtractor={item => item.id.toString()}
                    ref={(ref) => { this.flatListRef = ref; }}
                    onEndReachedThreshold={0.25}
                    onEndReached={this._loadMore}
                    // onRefresh={this._handleRefresh}
                    // refreshing={search.didInvalidate}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    ListFooterComponent={() => {
                        if (!search.isFetching) {
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
                                                    fontSize: 27,
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
        console.log('in article save')
        this.props.dispatch(saveArticle(article))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        console.log('in article remove')
        this.props.dispatch(removeSavedArticle(articleId))
        this.setState({
            snackbarRemovedVisible: true
        })
    }

    _loadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { activeDomain, navigation } = this.props;
            const searchTerm = navigation.getParam('searchTerm', '');
            this.props.dispatch(fetchMoreSearchArticlesIfNeeded(activeDomain.url, searchTerm))
            this.onEndReachedCalledDuringMomentum = true;
        }
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
        paddingHorizontal: 5
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

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: state.activeDomain,
        search: state.searchArticles,
        menus: state.menus,
        searchArticles: state.searchArticles.items.map(articleId => {
            const found = state.savedArticles.find(savedArticle => {
                return savedArticle.id === articleId;
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

export default connect(mapStateToProps)(SearchScreen);