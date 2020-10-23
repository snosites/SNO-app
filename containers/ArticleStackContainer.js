import { connect } from 'react-redux'
import ArticleStack from '../navigation/ArticleStack'

const mapStateToProps = (state) => ({
    homeScreenMode: state.global.homeScreenMode,
    theme: state.theme,
    activeCategory: state.global.activeCategory,
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(ArticleStack)
