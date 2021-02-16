import { connect } from 'react-redux'

import ProfileScreen from '../../screens/ProfileScreen'

import { actions as profileActions } from '../../redux/profiles'
import { actions as articleActions } from '../../redux/articles'
import { getActiveDomain } from '../../redux/domains'

const mapStateToProps = (state) => {
    return {
        activeDomain: getActiveDomain(state),
        theme: state.theme,
        profile: state.profiles.single,
        articles: state.entities.articles,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchProfileArticles: (domainUrl, name) =>
        dispatch(profileActions.fetchProfileArticles(domainUrl, name)),
    asyncFetchArticleError: () => dispatch(articleActions.asyncFetchArticleError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
