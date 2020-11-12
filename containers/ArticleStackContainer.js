import { connect } from 'react-redux'
import ArticleStack from '../navigation/ArticleStack'

const getActiveCategoryTitle = (menus, categoryId) => {
    const category = menus.find((menu) => menu.object_id == categoryId)
    if (category) {
        return category.title
    }
    return ''
}

const mapStateToProps = (state) => ({
    homeScreenMode: state.global.homeScreenMode,
    theme: state.theme,
    activeCategory: getActiveCategoryTitle(state.global.menuItems, state.global.activeCategory),
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(ArticleStack)
