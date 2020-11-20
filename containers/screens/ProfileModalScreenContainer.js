import { connect } from 'react-redux'

import ProfileModalScreen from '../../screens/ProfileModalScreen'

import { actions as profileActions, types as ProfileTypes } from '../../redux/profiles'
import {
    types as userTypes,
    actions as userActions,
    getWriterSubscriptions,
} from '../../redux/user'
import { getActiveDomain } from '../../redux/domains'

import { createLoadingSelector } from '../../redux/loading'
import { createErrorMessageSelector } from '../../redux/errors'

const profileLoadingSelector = createLoadingSelector([ProfileTypes.FETCH_PROFILE])
const profileErrorSelector = createErrorMessageSelector([ProfileTypes.FETCH_PROFILE])

const subscribeLoadingSelector = createLoadingSelector([userTypes.SUBSCRIBE])
const unsubscribeLoadingSelector = createLoadingSelector([userTypes.UNSUBSCRIBE])

const mapStateToProps = (state) => {
    return {
        activeDomain: getActiveDomain(state),
        theme: state.theme,
        profile: state.profiles.single,
        profileIsLoading: profileLoadingSelector(state),
        profileError: profileErrorSelector(state),
        writerSubscriptions: getWriterSubscriptions(state),
        subscribeLoading: subscribeLoadingSelector(state),
        unsubscribeLoading: unsubscribeLoadingSelector(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchProfile: (profileId) => dispatch(profileActions.fetchProfile(profileId)),
    subscribe: (payload) => dispatch(userActions.subscribe(payload)),
    unsubscribe: (payload) => dispatch(userActions.unsubscribe(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModalScreen)
