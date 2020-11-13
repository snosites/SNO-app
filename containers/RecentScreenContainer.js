import { connect } from 'react-redux'

import RecentScreen from '../screens/RecentScreen'

import { getActiveDomain } from '../redux/domains'
import { actions as recentActions } from '../redux/recent'
import { actions as savedArticleActions } from '../redux/savedArticles'

const mapStateToProps = (state) => {
    const activeDomain = getActiveDomain(state)
    return {
        theme: state.theme,
        activeDomain,
        global: state.global,
        recent: state.recentArticles,
        recentArticles: state.recentArticles.items.map((articleId) => {
            const found = state.savedArticlesBySchool[activeDomain.id].find((savedArticle) => {
                return savedArticle.id === articleId
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

const mapdispatchToProps = (dispatch) => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
    invalidateRecentArticles: (categoryId) =>
        dispatch(recentActions.invalidateRecentArticles(categoryId)),
    fetchRecentArticlesIfNeeded: (domainUrl) =>
        dispatch(recentActions.fetchRecentArticlesIfNeeded(domainUrl)),
    fetchMoreRecentArticlesIfNeeded: (payload) =>
        dispatch(recentActions.fetchMoreRecentArticlesIfNeeded(payload)),
})

export default connect(mapStateToProps, mapdispatchToProps)(RecentScreen)
