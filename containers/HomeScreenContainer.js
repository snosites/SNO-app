import { connect } from 'react-redux'
import HomeScreen from '../screens/HomeScreen'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { actions as articlesActions } from '../redux/articles'
import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as adActions, getHomeAds } from '../redux/ads'

import { getActiveDomain } from '../redux/domains'

const mapStateToProps = (state) => {
    const activeDomain = getActiveDomain(state)
    const homeScreenCategories = state.global.homeScreenCategories
    const homeScreenCategoryAmounts = state.global.homeScreenCategoryAmounts

    const homeScreenData = []

    for (let i = 0; i < homeScreenCategories.length; i++) {
        const categoryId = homeScreenCategories[i]
        let matchedArticles = []

        if (state.articlesByCategory[categoryId] && state.articlesByCategory[categoryId].items) {
            matchedArticles = state.articlesByCategory[categoryId].items
                .map((articleId) => {
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
                .slice(0, Number(homeScreenCategoryAmounts[i]))
        }

        homeScreenData.push({
            title: state.global.menuItems.find(
                (menuItem) => menuItem.object_id == homeScreenCategories[i]
            ).title,
            data: matchedArticles,
        })
    }

    if (!homeScreenCategories.length) {
        return {
            theme: state.theme,
            activeDomain,
            menus: state.global.menuItems,
            global: state.global,
            homeScreenData: homeScreenData,
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
        homeScreenData: homeScreenData,
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
