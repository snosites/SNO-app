import React from 'react'
import { connect } from 'react-redux'
import ArticleScreen from '../screens/ArticleScreen'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getActiveDomain } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

import { ArticleIdContext } from '../navigation/ArticleNavigator'

const ArticleScreenConsumer = (props) => (
    <ArticleIdContext.Consumer>
        {(value) => <ArticleScreen {...props} articleId={value} />}
    </ArticleIdContext.Consumer>
)

const startupErrorSelector = createErrorMessageSelector([globalTypes.STARTUP])
const startupLoadingSelector = createLoadingSelector([globalTypes.STARTUP])

const mapStateToProps = (state) => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
    articles: state.entities.articles,
})

const mapDispatchToProps = (dispatch) => ({
    startup: (domain) => dispatch(globalActions.startup(domain)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleScreenConsumer)
