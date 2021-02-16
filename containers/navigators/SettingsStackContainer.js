import { connect } from 'react-redux'
import SettingsStack from '../../navigation/SettingsStack'

const mapStateToProps = (state) => ({
    theme: state.theme,
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(SettingsStack)
