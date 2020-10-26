import { connect } from 'react-redux'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { getActiveDomain } from '../redux/domains'
import { actions as userActions, getPushToken, getWriterSubscriptions } from '../redux/user'
import { actions as adActions, getStoryAds } from '../redux/ads'

import ArticleScreen from '../screens/ArticleScreen'

const mapStateToProps = (state) => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
    pushToken: getPushToken(state),
    writerSubscriptions: getWriterSubscriptions(state),
    enableComments: state.global.enableComments,
    storyAds: getStoryAds(state),
})

const mapDispatchToProps = (dispatch) => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    subscribe: (payload) => dispatch(userActions.subscribe(payload)),
    sendAdAnalytic: (url, imageId, field) =>
        dispatch(adActions.sendAdAnalytic(url, imageId, field)),
    fetchSnoAdImage: (adSpotId, fallbackUrl) =>
        dispatch(adActions.fetchSnoAdImage(adSpotId, fallbackUrl)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleScreen)
