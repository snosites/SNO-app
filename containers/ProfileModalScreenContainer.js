import { connect } from 'react-redux'

import ProfileModalScreen from '../screens/ProfileModalScreen'

import { actions as profileActions, types as ProfileTypes } from '../redux/profiles'
import { getActiveDomain } from '../redux/domains'

import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

const profileLoadingSelector = createLoadingSelector([ProfileTypes.FETCH_PROFILE])
const profileErrorSelector = createErrorMessageSelector([ProfileTypes.FETCH_PROFILE])

const mapStateToProps = (state) => {
    return {
        activeDomain: getActiveDomain(state),
        theme: state.theme,
        profile: state.profiles.single,
        profileIsLoading: profileLoadingSelector(state),
        profileError: profileErrorSelector(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchProfile: (profileId) => dispatch(profileActions.fetchProfile(profileId)),
    fetchProfileArticles: (domainUrl, name) =>
        dispatch(profileActions.fetchProfileArticles(domainUrl, name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModalScreen)
