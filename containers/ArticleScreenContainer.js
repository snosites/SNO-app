import { connect } from 'react-redux'
import ArticleScreen from '../screens/ArticleScreen'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getActiveDomain } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

const startupErrorSelector = createErrorMessageSelector([globalTypes.STARTUP])
const startupLoadingSelector = createLoadingSelector([globalTypes.STARTUP])

const mapStateToProps = (state) => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
})

const mapDispatchToProps = (dispatch) => ({
    startup: (domain) => dispatch(globalActions.startup(domain)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleScreen)
