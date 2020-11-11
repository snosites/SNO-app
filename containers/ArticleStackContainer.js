import { connect } from 'react-redux'
import ArticleStack from '../navigation/ArticleStack'

const getActiveCategoryTitle = (menus, categoryId) => {
    return menus.find((menu) => menu.object_id == categoryId).title
}

const mapStateToProps = (state) => ({
    homeScreenMode: state.global.homeScreenMode,
    theme: state.theme,
    activeCategory: getActiveCategoryTitle(state.global.menuItems, state.global.activeCategory),
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(ArticleStack)
