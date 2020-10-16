import { connect } from 'react-redux'

import LocationSelectScreen from '../screens/setup/LocationSelect'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as domainsActions } from '../redux/domains'
import { actions as userActions } from '../redux/user'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

const availableDomainsLoadingSelector = createLoadingSelector([globalTypes.FETCH_AVAILABLE_DOMAINS])
const availableDomainsErrorSelector = createErrorMessageSelector([
    globalTypes.FETCH_AVAILABLE_DOMAINS,
])

const mapStateToProps = (state) => ({
    availableDomains: state.global.availableDomains,
    domains: state.domains,
    isLoading: availableDomainsLoadingSelector(state),
    error: availableDomainsErrorSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
    fetchAvailableDomains: () => dispatch(globalActions.fetchAvailableDomains()),
    setActiveDomain: (domainId) => dispatch(domainsActions.setActiveDomain(domainId)),
    addDomain: (domain) => dispatch(domainsActions.addDomain(domain)),
    clearAvailableDomains: () => dispatch(globalActions.clearAvailableDomains()),
    setSubscribeAll: (payload) => dispatch(userActions.setSubscribeAll(payload)),
    addSchoolSub: (url) => dispatch(globalActions.addSchoolSub(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationSelectScreen)
