import { connect } from 'react-redux'

import { actions as savedArticleActions } from '../../redux/savedArticles'
import { actions as articlesActions } from '../../redux/articles'
import { actions as adActions, getListAds } from '../../redux/ads'

import { getActiveDomain } from '../../redux/domains'

import ListScreen from '../../screens/ListScreen'

const mapStateToProps = (state) => {
    // gets category ID from navigation params or defaults to first item in the list
    const categoryId = state.global.activeCategory
    const activeDomain = getActiveDomain(state)
    const listAds = getListAds(state)

    console.log('categoryId', categoryId, state.articlesByCategory)

    // const menuCategoryItem = state.global.menuItems.find((item) => item.object_id == categoryId)
    // console.log('category', menuCategoryItem)

    if (!categoryId || !state.articlesByCategory[categoryId]) {
        console.log('UGH')
        return {
            theme: state.theme,
            activeDomain,
            menus: state.global.menuItems,
            category: {
                isFetching: false,
            },
            categoryId,
            articlesByCategory: [],
            global: state.global,
            listAds,
        }
    }
    return {
        theme: state.theme,
        activeDomain,
        menus: state.global.menuItems,
        global: state.global,
        listAds,
        categoryId,
        category: state.articlesByCategory[categoryId],
        articlesByCategory: state.articlesByCategory[categoryId].items.map((articleId) => {
            const found = state.savedArticlesBySchool[activeDomain.id].find((savedArticle) => {
                return savedArticle.id == articleId
            })
            if (found) {
                state.entities.articles[articleId].saved = true
            } else {
                state.entities.articles[articleId].saved = false
            }
            return state.entities.articles[articleId]
        }),
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
    invalidateArticles: (categoryId) => dispatch(articlesActions.invalidateArticles(categoryId)),
    fetchArticlesIfNeeded: (payload) => dispatch(articlesActions.fetchArticlesIfNeeded(payload)),
    fetchMoreArticlesIfNeeded: (payload) =>
        dispatch(articlesActions.fetchMoreArticlesIfNeeded(payload)),
    sendAdAnalytic: (url, imageId, field) =>
        dispatch(adActions.sendAdAnalytic(url, imageId, field)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen)
