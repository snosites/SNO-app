import React from 'react'
import { connect } from 'react-redux'

import ArticleScreen from '../../screens/ArticleScreen'

import { getStoryAds } from '../../redux/ads'
import { getActiveDomain } from '../../redux/domains'

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
    storyAds: getStoryAds(state),
})

export default connect(mapStateToProps)(ArticleScreenConsumer)
