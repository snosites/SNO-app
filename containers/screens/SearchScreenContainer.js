import { connect } from 'react-redux'

import SearchScreen from '../../screens/SearchScreen'

import { actions as searchActions } from '../../redux/search'
import { getActiveDomain } from '../../redux/domains'

const mapStateToProps = (state) => {
    const activeDomain = getActiveDomain(state)
    return {
        theme: state.theme,
        activeDomain,
        search: state.searchArticles,
        storyListStyle: state.global.storyListStyle,
        searchArticles: state.searchArticles.items.map((articleId) => {
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

const mapDispatchToProps = (dispatch) => ({
    fetchMoreSearchArticlesIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchActions.fetchMoreSearchArticlesIfNeeded(domainUrl, searchTerm)),
    fetchSearchArticlesIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchActions.fetchSearchArticlesIfNeeded(domainUrl, searchTerm)),
    invalidateSearchArticles: () => dispatch(searchActions.invalidateSearchArticles()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)
