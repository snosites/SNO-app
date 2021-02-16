// import { connect } from 'react-redux'

// import NotificationAlert from '../components/NotificationAlert'

// import { actions as domainActions, getActiveDomain } from '../redux/domains'
// import { actions as userActions } from '../redux/user'
// import { createLoadingSelector } from '../redux/loading'
// import { types as globalTypes, actions as globalActions } from '../redux/global'

// const initializingStartupSelector = createLoadingSelector([globalTypes.STARTUP])
// const initializingUserSelector = createLoadingSelector([globalTypes.INITIALIZE_USER])

const mapStateToProps = (state) => ({
    user: state.user.user,
    activeDomain: getActiveDomain(state),
    domains: state.domains,
    initialized: state.global.initialized,
    deepLinkArticle: state.global.deepLinkArticle,
})

const mapDispatchToProps = (dispatch) => ({
    setActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
    setFromPush: (payload) => dispatch(userActions.setFromPush(payload)),
    setDeepLinkArticle: (payload) => dispatch(globalActions.setDeepLinkArticle(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationAlert)
