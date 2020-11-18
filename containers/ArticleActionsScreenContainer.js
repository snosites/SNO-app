import { connect } from 'react-redux'
import ArticleActionsScreen from '../screens/ArticleActionsScreen'

const mapStateToProps = (state) => ({
    theme: state.theme,
})

export default connect(mapStateToProps)(ArticleActionsScreen)
