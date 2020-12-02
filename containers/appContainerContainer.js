import { connect } from 'react-redux'
import AppContainer from '../components/AppContainer'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { types as userTypes, actions as userActions } from '../redux/user'
import { createErrorMessageSelector } from '../redux/errors'
import { actions as domainActions, getActiveDomain } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'

const initializeUserErrorSelector = createErrorMessageSelector([globalTypes.INITIALIZE_USER])
const initializeUserLoading = createLoadingSelector([globalTypes.INITIALIZE_USER])

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        homeScreenMode: state.global.homeScreenMode,
        initializeUserLoading: initializeUserLoading(state),
        initializeUserError: initializeUserErrorSelector(state),
        activeDomain: getActiveDomain(state),
        user: state.user.user,
        initialized: state.global.initialized,
        firstInstall: state.user.firstInstall,
        domains: state.domains,
        // fromDeepLink: state.global.fromDeepLink,
    }
}

const mapDispatchToProps = (dispatch) => ({
    initializeUser: () => dispatch(globalActions.initializeUser()),
    setInitialized: (payload) => dispatch(globalActions.setInitialized(payload)),
    setActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
    setFirstInstall: (payload) => dispatch(userActions.setFirstInstall(payload)),
    // initializeDeepLinkUser: (params) => dispatch(globalActions.initializeDeepLinkUser(params)),
    // setDeepLinkArticle: (payload) => dispatch(globalActions.setDeepLinkArticle(payload)),
    // setFromDeepLink: (payload) => dispatch(globalActions.setFromDeepLink(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
