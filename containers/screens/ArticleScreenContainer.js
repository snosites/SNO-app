import React from 'react'
import { connect } from 'react-redux'

import ArticleScreen from '../../screens/ArticleScreen'

import { types as globalTypes, actions as globalActions } from '../../redux/global'
import { getActiveDomain } from '../../redux/domains'
import { createLoadingSelector } from '../../redux/loading'
import { createErrorMessageSelector } from '../../redux/errors'

import { ArticleContext } from '../../navigation/ArticleNavigator'

const ArticleScreenConsumer = (props) => (
    <ArticleContext.Consumer>
        {(value) => <ArticleScreen {...props} article={value} />}
    </ArticleContext.Consumer>
)

const mapStateToProps = (state) => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
    enableComments: state.global.enableComments,
})

export default connect(mapStateToProps)(ArticleScreenConsumer)
