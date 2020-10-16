import { connect } from 'react-redux'
import MainStack from '../navigation/MainStack'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getActiveDomain } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

const startupErrorSelector = createErrorMessageSelector([globalTypes.STARTUP])
const startupLoadingSelector = createLoadingSelector([globalTypes.STARTUP])

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
    user: state.user,
    splashScreen: state.global.splashScreen,
    startupLoading: startupLoadingSelector(state),
    startupError: startupErrorSelector(state),
    menus: state.global.menuItems,
    articlesByCategory: state.articlesByCategory,
})

const mapDispatchToProps = (dispatch) => ({
    startup: (domain) => dispatch(globalActions.startup(domain)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainStack)
