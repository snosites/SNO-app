import { connect } from 'react-redux'

import SportcenterScreen from '../../screens/SportcenterScreen'

import { actions as profileActions } from '../../redux/profiles'
import { getActiveDomain } from '../../redux/domains'

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        global: state.global,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchProfiles: (domainUrl, year) => dispatch(profileActions.fetchProfiles(domainUrl, year)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SportcenterScreen)
