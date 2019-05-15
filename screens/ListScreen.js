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

import ArticleListContent from '../views/ArticleListContent';

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
        const { navigation, articlesByCategory, category, theme, activeDomain } = this.props;
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
                <ArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate}
                    loadMore={this._loadMore}
                    handleRefresh={this._handleRefresh}
                    saveRef={this._saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    navigation={navigation}
                    onIconPress={this._saveRemoveToggle}
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

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }

    _saveRef = (ref) => {
        this.flatListRef = ref;
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
        const { activeDomain, category } = this.props;
        this.props.dispatch(fetchMoreArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        }))
    }

    _setShouldLoadMore = () => {

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
    animationContainer: {
        width: 400,
        height: 400,
    },
    animationContainerError: {
        width: 200,
        height: 200,
    },
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
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