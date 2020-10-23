import { connect } from 'react-redux'
import TabNavigator from '../navigation/TabNavigator'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getActiveDomain } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

const startupErrorSelector = createErrorMessageSelector([globalTypes.STARTUP])
const startupLoadingSelector = createLoadingSelector([globalTypes.STARTUP])

const mapStateToProps = (state) => ({
    theme: state.theme,
    sportCenterEnabled: state.global.sportCenterEnabled,
})

export default connect(mapStateToProps)(TabNavigator)
