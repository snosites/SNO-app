import React from 'react'
import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import Color from 'color'
import { connect } from 'react-redux'

import LottieView from 'lottie-react-native'

import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Snackbar, Button } from 'react-native-paper'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { actions as articlesActions } from '../redux/articles'

import { getActiveDomain } from '../redux/domains'

import { SafeAreaView } from 'react-navigation'

import ArticleListContent from '../views/ArticleListContent'

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton
        {...passMeFurther}
        IconComponent={Ionicons}
        iconSize={30}
        color={Colors.tintColor}
    />
)

//header title -- work on later
// const HeaderTitle = ({name}) => {
//     return (
//         <Animated.Text
//             numberOfLines={1}
//             {...rest}
//             style={[styles.title, style]}
//             accessibilityTraits="header"
//         />
//         <HTML
//             html={name}
//             customWrapper={(text) => {
//                 return (
//                     <Text
//                         ellipsizeMode='tail'
//                         numberOfLines={1}
//                         style={styles.title}
//                     >
//                         {text}
//                     </Text>
//                 )
//             }}
//         />
//     )
// }

class ListScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { theme } = screenProps
        const logo = navigation.getParam('headerLogo', null)
        const headerName = navigation.getParam('menuTitle', 'Stories')
        let primaryColor = Color(theme.colors.primary)
        let isDark = primaryColor.isDark()
        return {
            title: headerName,
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item
                        title='menu'
                        iconName='ios-menu'
                        buttonStyle={{ color: isDark ? 'white' : 'black' }}
                        onPress={() => navigation.openDrawer()}
                    />
                </HeaderButtons>
            ),
            headerLeft: logo && (
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='contain'
                />
            ),
            headerBackTitle: null
        }
    }

    state = {
        snackbarSavedVisible: false,
        snackbarRemovedVisible: false
    }

    componentDidMount() {
        const { navigation, global } = this.props
        if (this.animation) {
            this._playAnimation()
        }
        navigation.setParams({
            headerLogo: global.headerSmall
        })
    }

    componentDidUpdate() {
        if (this.animation) {
            this._playAnimation()
        }
        const { navigation } = this.props
        if (navigation.state.params && navigation.state.params.scrollToTop) {
            if (this.flatListRef) {
                // scroll list to top
                this._scrollToTop()
            }
            navigation.setParams({ scrollToTop: false })
        }
    }

    render() {
        const { navigation, articlesByCategory, category, theme, activeDomain } = this.props
        const { snackbarSavedVisible, snackbarRemovedVisible } = this.state
        const categoryId = this.props.navigation.getParam('categoryId', null)
        if (!categoryId) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: 20
                    }}
                >
                    <LottieView
                        ref={animation => this._saveAnimationRef(animation)}
                        style={StyleSheet.absoluteFill}
                        speed={0.8}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/multi-article-loading')}
                    />
                </SafeAreaView>
            )
        }
        if (articlesByCategory.length === 0 && category.isFetching) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: 20
                    }}
                >
                    <LottieView
                        ref={animation => this._saveAnimationRef(animation)}
                        style={StyleSheet.absoluteFill}
                        speed={0.8}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/multi-article-loading')}
                    />
                </SafeAreaView>
            )
        }
        if (category.error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 200,
                            height: 200
                        }}
                    >
                        <LottieView
                            ref={animation => this._saveAnimationRef(animation)}
                            style={{
                                width: 200,
                                height: 200
                            }}
                            loop={true}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/broken-stick-error')}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                        Sorry, something went wrong.
                    </Text>
                    <Button
                        mode='contained'
                        theme={{
                            roundness: 7,
                            colors: {
                                primary: theme ? theme.colors.primary : '#2099CE'
                            }
                        }}
                        style={{ padding: 5 }}
                        onPress={this._handleRefresh}
                    >
                        Reload
                    </Button>
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
        )
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    _saveRef = ref => {
        this.flatListRef = ref
    }

    _saveAnimationRef = ref => {
        this.animation = ref
    }

    _saveRemoveToggle = article => {
        if (article.saved) {
            this._handleArticleRemove(article.id)
        } else {
            this._handleArticleSave(article)
        }
    }

    _handleArticleSave = article => {
        const { activeDomain, saveArticle } = this.props
        saveArticle(article, activeDomain.id)
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        const { activeDomain } = this.props
        this.props.removeSavedArticle(articleId, activeDomain.id)
        this.setState({
            snackbarRemovedVisible: true
        })
    }

    _loadMore = () => {
        const { activeDomain, category, fetchMoreArticlesIfNeeded } = this.props
        fetchMoreArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId
        })
    }

    _handleRefresh = () => {
        const { activeDomain, category, invalidateArticles, fetchArticlesIfNeeded } = this.props
        invalidateArticles(category.categoryId)
        fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId
        })
    }

    _playAnimation = () => {
        this.animation.reset()
        this.animation.play()
    }
}

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    title: {
        ...Platform.select({
            ios: {
                fontSize: 17,
                fontWeight: '600',
                color: 'rgba(0, 0, 0, .9)',
                marginHorizontal: 16
            },
            android: {
                fontSize: 20,
                fontWeight: '500',
                color: 'rgba(0, 0, 0, .9)',
                marginHorizontal: 16
            },
            default: {
                fontSize: 18,
                fontWeight: '400',
                color: '#3c4043'
            }
        })
    }
})

const mapStateToProps = (state, ownProps) => {
    // gets category ID from navigation params or defaults to first item in the list
    const categoryId = ownProps.navigation.getParam('categoryId', null)
    const activeDomain = getActiveDomain(state)
    if (!categoryId) {
        return {
            theme: state.theme,
            activeDomain,
            menus: state.global.menuItems,
            category: null,
            articlesByCategory: [],
            global: state.global
        }
    }
    return {
        theme: state.theme,
        activeDomain,
        menus: state.global.menuItems,
        global: state.global,
        category: state.articlesByCategory[categoryId],
        articlesByCategory: state.articlesByCategory[categoryId].items.map(articleId => {
            const found = state.savedArticlesBySchool[activeDomain.id].find(savedArticle => {
                return savedArticle.id == articleId
            })
            if (found) {
                state.entities.articles[articleId].saved = true
            } else {
                state.entities.articles[articleId].saved = false
            }
            return state.entities.articles[articleId]
        })
    }
}

const mapDispatchToProps = dispatch => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
    invalidateArticles: categoryId => dispatch(articlesActions.invalidateArticles(categoryId)),
    fetchArticlesIfNeeded: payload => dispatch(articlesActions.fetchArticlesIfNeeded(payload)),
    fetchMoreArticlesIfNeeded: payload =>
        dispatch(articlesActions.fetchMoreArticlesIfNeeded(payload))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListScreen)
