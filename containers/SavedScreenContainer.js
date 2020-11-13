import { connect } from 'react-redux'

import SavedScreen from '../screens/SavedScreen'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { getActiveDomain } from '../redux/domains'

const mapStateToProps = (state) => {
    const activeDomain = getActiveDomain(state)
    return {
        activeDomain,
        theme: state.theme,
        global: state.global,
        savedArticles: state.savedArticlesBySchool[activeDomain.id]
            ? state.savedArticlesBySchool[activeDomain.id]
            : [],
    }
}

const mapDispatchToProps = (dispatch) => ({
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SavedScreen)
