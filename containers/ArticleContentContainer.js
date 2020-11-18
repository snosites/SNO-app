import React from 'react'
import { connect } from 'react-redux'
import ArticleContent from '../components/Article/ArticleContent'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { getActiveDomain } from '../redux/domains'

const mapStateToProps = (state) => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
})

const mapDispatchToProps = (dispatch) => ({
    startup: (domain) => dispatch(globalActions.startup(domain)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContent)
