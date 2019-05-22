import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform
} from 'react-native';
import Moment from 'moment';
import Color from 'color';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';
const { Lottie } = DangerZone;

import Animation from '../views/Animation';

import Colors from '../constants/Colors'
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Snackbar, Badge } from 'react-native-paper';

import {
    saveArticle,
    removeSavedArticle,
    fetchMoreSearchArticlesIfNeeded,
} from '../redux/actionCreators';

import ArticleListContent from '../views/ArticleListContent';

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
                    style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='contain'
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

    render() {
        const { navigation, searchArticles, search, theme, activeDomain } = this.props;
        const { snackbarSavedVisible, snackbarRemovedVisible } = this.state;

        if (search.didInvalidate === true && search.isFetching) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animation
                        style={{
                            width: 400,
                            height: 400
                        }}
                        source={require('../assets/lottiefiles/search-processing')}
                        saveRef={this._saveAnimationRef}
                        speed={1}
                    />
                </View>
            )
        }
        if (search.error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animation
                        style={{
                            width: 200,
                            height: 200
                        }}
                        source={require('../assets/lottiefiles/broken-stick-error')}
                        saveRef={this._saveAnimationRef}
                        speed={1}
                    />
                    <Text 
                        style={{ 
                            textAlign: 'center', 
                            fontSize: 17, 
                            padding: 30 
                        }}
                    >
                        Sorry, something went wrong.
                    </Text>
                </View>
            )
        }
        if (search.items.length == 0) {
            return (
                <View style={{ flex: 1 }}>
                    <Text 
                        style={{ 
                            textAlign: 'center', 
                            fontSize: 17, 
                            padding: 20, 
                            fontWeight: 'bold' 
                        }}
                    >
                        No results.  Try searching again.
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <ArticleListContent
                    articleList={searchArticles}
                    isFetching={search.isFetching}
                    loadMore={this._loadMore}
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

    _saveRef = (ref) => {
        this.flatListRef = ref;
    }

    _saveAnimationRef = (ref) => {
        this.animation = ref;
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
        const { activeDomain } = this.props;
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

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: state.activeDomain,
        search: state.searchArticles,
        menus: state.menus,
        searchArticles: state.searchArticles.items.map(articleId => {
            const found = state.savedArticlesBySchool[state.activeDomain.id].find(savedArticle => {
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