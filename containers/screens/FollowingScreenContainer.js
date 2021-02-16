import { connect } from 'react-redux'

import FollowingScreen from '../../screens/FollowingScreen'

import { actions as domainActions, getActiveDomain } from '../../redux/domains'
import { actions as globalActions } from '../../redux/global'
import { actions as profileActions, types as ProfileTypes } from '../../redux/profiles'
import {
    types as userTypes,
    actions as userActions,
    getWriterSubscriptions,
} from '../../redux/user'

import { createLoadingSelector } from '../../redux/loading'
import { createErrorMessageSelector } from '../../redux/errors'

const profileLoadingSelector = createLoadingSelector([ProfileTypes.FETCH_PROFILE])
const profileErrorSelector = createErrorMessageSelector([ProfileTypes.FETCH_PROFILE])

const subscribeLoadingSelector = createLoadingSelector([userTypes.SUBSCRIBE])
const unsubscribeLoadingSelector = createLoadingSelector([userTypes.UNSUBSCRIBE])

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        domains: state.domains,
        userInfo: state.user,
        activeDomain: getActiveDomain(state),
        writerSubscriptions: getWriterSubscriptions(state),
        subscribeLoading: subscribeLoadingSelector(state),
        unsubscribeLoading: unsubscribeLoadingSelector(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
        saveUserInfo: (payload) => dispatch(userActions.saveUserInfo(payload)),
        updateUser: (key, value) => dispatch(userActions.updateUser(key, value)),
        deleteDomain: (domainId) => dispatch(domainActions.deleteDomain(domainId)),
        removeSchoolSub: (url) => dispatch(globalActions.removeSchoolSub(url)),
        fetchProfile: (profileId) => dispatch(profileActions.fetchProfile(profileId)),
        subscribe: (payload) => dispatch(userActions.subscribe(payload)),
        unsubscribe: (payload) => dispatch(userActions.unsubscribe(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowingScreen)
