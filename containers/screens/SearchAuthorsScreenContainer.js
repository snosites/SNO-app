import { connect } from 'react-redux'

import SearchAuthorsScreen from '../../screens/SearchAuthorsScreen'

import { actions as searchAuthorActions } from '../../redux/searchAuthors'
import { getActiveDomain } from '../../redux/domains'

const mapStateToProps = (state) => {
    const activeDomain = getActiveDomain(state)
    return {
        theme: state.theme,
        activeDomain,
        search: state.searchAuthors,
        searchAuthors: state.searchAuthors.items,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchMoreSearchAuthorsIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchAuthorActions.fetchMoreSearchAuthorsIfNeeded(domainUrl, searchTerm)),
    fetchSearchAuthorsIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchAuthorActions.fetchSearchAuthorsIfNeeded(domainUrl, searchTerm)),
    invalidateSearchAuthors: () => dispatch(searchAuthorActions.invalidateSearchAuthors()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchAuthorsScreen)
