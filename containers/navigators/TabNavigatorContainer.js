import { connect } from 'react-redux'
import TabNavigator from '../../navigation/TabNavigator'

const mapStateToProps = (state) => ({
    theme: state.theme,
    sportCenterEnabled: state.global.sportCenterEnabled,
    user: state.user.user,
})

export default connect(mapStateToProps)(TabNavigator)
