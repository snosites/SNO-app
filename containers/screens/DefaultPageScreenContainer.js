import { connect } from 'react-redux'

import DefaultPageScreen from '../../screens/DefaultPageScreen'

import { types as pageTypes, actions as pageActions } from '../../redux/pages'

import { getActiveDomain } from '../../redux/domains'

import { createLoadingSelector } from '../../redux/loading'
import { createErrorMessageSelector } from '../../redux/errors'

const fetchPageLoadingSelector = createLoadingSelector([pageTypes.FETCH_PAGE])

const fetchPageErrorSelector = createErrorMessageSelector([pageTypes.FETCH_PAGE])

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        global: state.global,
        activeCategory: state.global.activeCategory,
        isLoading: fetchPageLoadingSelector(state),
        error: fetchPageErrorSelector(state),
        page: state.pages.single,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchPage: (pageId) => dispatch(pageActions.fetchPage(pageId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPageScreen)
