import { connect } from 'react-redux'

import UserInfoModal from '../../screens/UserInfoModal'

import { types as userTypes, actions as userActions } from '../../redux/user'
import { getActiveDomain } from '../../redux/domains'

import { createLoadingSelector } from '../../redux/loading'
import { createErrorMessageSelector } from '../../redux/errors'

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        userInfo: state.user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveUserInfo: (payload) => dispatch(userActions.saveUserInfo(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoModal)
