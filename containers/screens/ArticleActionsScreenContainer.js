import React from 'react'
import { connect } from 'react-redux'

import ArticleActionsScreen from '../../screens/ArticleActionsScreen'

import { actions as savedArticleActions } from '../../redux/savedArticles'
import { getActiveDomain } from '../../redux/domains'

import { ArticleContext } from '../../navigation/ArticleNavigator'

const ArticleScreenConsumer = (props) => (
    <ArticleContext.Consumer>
        {(value) => <ArticleActionsScreen {...props} article={value} />}
    </ArticleContext.Consumer>
)

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
    theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleScreenConsumer)
