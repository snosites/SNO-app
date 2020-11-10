import { connect } from 'react-redux'
import HomeScreen from '../screens/HomeScreen'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { actions as articlesActions } from '../redux/articles'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as adActions, getHomeAds } from '../redux/ads'
import { createLoadingSelector } from '../redux/loading'

import { getActiveDomain } from '../redux/domains'

const homeScreenLoadingSelector = createLoadingSelector([globalTypes.FETCH_HOME_SCREEN_ARTICLES])

const mapStateToProps = (state) => {
    const activeDomain = getActiveDomain(state)
    const homeScreenCategories = state.global.homeScreenCategories

    if (!homeScreenCategories.length) {
        return {
            theme: state.theme,
            activeDomain,
            menus: state.global.menuItems,
            global: state.global,
            articlesByCategory: [],
            isLoading: homeScreenLoadingSelector(state),
            articlesLoading: false,
            homeAds: getHomeAds(state),
        }
    }
    return {
        homeAds: getHomeAds(state),
        theme: state.theme,
        activeDomain,
        menus: state.global.menuItems,
        global: state.global,
        isLoading: homeScreenLoadingSelector(state),
        categoryTitles: homeScreenCategories.map((category) => {
            return state.global.menuItems.find((menuItem) => menuItem.object_id == category).title
        }),
        articlesByCategory: homeScreenCategories.map((categoryId) => {
            if (
                state.articlesByCategory[categoryId] &&
                state.articlesByCategory[categoryId].items
            ) {
                return state.articlesByCategory[categoryId].items.map((articleId) => {
                    const found = state.savedArticlesBySchool[activeDomain.id].find(
                        (savedArticle) => {
                            return savedArticle.id == articleId
                        }
                    )
                    if (found) {
                        state.entities.articles[articleId].saved = true
                    } else {
                        state.entities.articles[articleId].saved = false
                    }
                    return state.entities.articles[articleId]
                })
            } else {
                return []
            }
        }),
        articlesLoading: homeScreenCategories.reduce((accum, categoryId) => {
            if (state.articlesByCategory[categoryId]) {
                return state.articlesByCategory[categoryId].isFetching
            } else {
                return false
            }
        }, false),
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
    refreshHomeScreen: () => dispatch(globalActions.fetchHomeScreenArticles()),
    invalidateArticles: (categoryId) => dispatch(articlesActions.invalidateArticles(categoryId)),
    setActiveCategory: (categoryId) => dispatch(globalActions.setActiveCategory(categoryId)),
    sendAdAnalytic: (url, imageId, field) =>
        dispatch(adActions.sendAdAnalytic(url, imageId, field)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
