import { connect } from 'react-redux'

import SettingsScreen from '../../screens/SettingsScreen'

import { actions as domainActions, getActiveDomain } from '../../redux/domains'
import { types as userTypes, actions as userActions } from '../../redux/user'
import { actions as globalActions } from '../../redux/global'
import { createLoadingSelector } from '../../redux/loading'
import { actions as themeActions } from '../../redux/theme'

const deleteUserLoadingSelector = createLoadingSelector([userTypes.DELETE_USER])

const unsubscribeLoadingSelector = createLoadingSelector([userTypes.UNSUBSCRIBE])

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        domains: state.domains,
        userInfo: state.user,
        global: state.global,
        activeDomain: getActiveDomain(state),
        isLoading: deleteUserLoadingSelector(state),
        unsubscribeLoading: unsubscribeLoadingSelector(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
        setInitialized: (payload) => dispatch(globalActions.setInitialized(payload)),
        deleteUser: () => dispatch(userActions.deleteUser()),
        deleteDomain: (domainId) => dispatch(domainActions.deleteDomain(domainId)),
        subscribe: (payload) => dispatch(userActions.subscribe(payload)),
        unsubscribe: (payload) => dispatch(userActions.unsubscribe(payload)),
        removeSchoolSub: (url) => dispatch(globalActions.removeSchoolSub(url)),
        toggleDarkMode: (darkMode) => dispatch(themeActions.toggleDarkMode(darkMode)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
