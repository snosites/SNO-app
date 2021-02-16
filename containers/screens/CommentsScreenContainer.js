import React from 'react'
import { connect } from 'react-redux'

import CommentsScreen from '../../screens/CommentsScreen'

import { types as articleTypes, actions as articleActions } from '../../redux/articles'
import { getActiveDomain } from '../../redux/domains'

import { ArticleContext } from '../../navigation/ArticleNavigator'

import { createLoadingSelector } from '../../redux/loading'

const commentLoadingSelector = createLoadingSelector([articleTypes.ADD_COMMENT])

const CommentsScreenConsumer = (props) => (
    <ArticleContext.Consumer>
        {(value) => <CommentsScreen {...props} article={value} />}
    </ArticleContext.Consumer>
)

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        userInfo: state.user,
        isLoading: commentLoadingSelector(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    addComment: (payload) => dispatch(articleActions.addComment(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreenConsumer)
