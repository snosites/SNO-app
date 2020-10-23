import { connect } from 'react-redux'
import DrawerNavigator from '../navigation/DrawerNavigator'

const mapStateToProps = (state) => ({
    theme: state.theme,
})

export default connect(mapStateToProps)(DrawerNavigator)
