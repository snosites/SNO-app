import { connect } from 'react-redux'

import CommentsScreen from '../screens/CommentsScreen'

import { actions as articleActions } from '../redux/articles'
import { actions as userActions } from '../redux/user'
import { getActiveDomain } from '../redux/domains'

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        userInfo: state.user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    addComment: (payload) => dispatch(articleActions.addComment(payload)),
    setCommentPosted: (payload) => dispatch(userActions.setCommentPosted(payload)),
    saveUserInfo: (payload) => dispatch(userActions.saveUserInfo(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreen)
