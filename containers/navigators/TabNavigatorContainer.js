import { connect } from 'react-redux'
import TabNavigator from '../../navigation/TabNavigator'

const mapStateToProps = (state) => ({
    theme: state.theme,
    sportCenterEnabled: state.global.sportCenterEnabled,
})

export default connect(mapStateToProps)(TabNavigator)
