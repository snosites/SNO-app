import { connect } from 'react-redux'

import ProfileScreen from '../../screens/ProfileScreen'

import { actions as profileActions } from '../../redux/profiles'
import { getActiveDomain } from '../../redux/domains'

const mapStateToProps = (state) => {
    return {
        activeDomain: getActiveDomain(state),
        theme: state.theme,
        profile: state.profiles.single,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchProfileArticles: (domainUrl, name) =>
        dispatch(profileActions.fetchProfileArticles(domainUrl, name)),
    clearProfileArticles: () => dispatch(profileActions.clearProfileArticles()),
    clearProfileError: () => dispatch(profileActions.clearProfileError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
