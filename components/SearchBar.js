import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Drawer, Colors, Searchbar as PaperSearchBar } from 'react-native-paper'

import { connect } from 'react-redux'

import { getActiveDomain } from '../redux/domains'
import { actions as searchActions } from '../redux/search'
import { actions as searchAuthorActions } from '../redux/searchAuthors'

const Searchbar = (props) => {
    const {
        navigation,
        placeholder,
        theme,
        activeDomain,
        invalidateSearchArticles,
        fetchSearchArticlesIfNeeded,
        fetchSearchAuthorsIfNeeded,
        invalidateSearchAuthors,
        authors = false,
    } = props

    const [searchTerm, setSearchTerm] = useState('')

    const _search = () => {
        if (authors) _searchAuthors()
        else _searchArticles()
    }

    const _searchArticles = () => {
        navigation.navigate('Search', { searchTerm })

        invalidateSearchArticles()
        fetchSearchArticlesIfNeeded(activeDomain.url, searchTerm)
        // setSearchTerm('')
    }

    const _searchAuthors = () => {
        navigation.navigate('SearchAuthors', { searchTerm })

        invalidateSearchAuthors()
        fetchSearchAuthorsIfNeeded(activeDomain.url, searchTerm)
        // setSearchTerm('')
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <PaperSearchBar
                style={{
                    width: 250,
                    height: 32,
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: 8,
                    padding: 5,
                }}
                inputStyle={{ color: 'white', fontSize: 16 }}
                iconColor={theme.extraColors.lightGray}
                placeholder={placeholder}
                onIconPress={_search}
                onSubmitEditing={_search}
                theme={{ colors: { placeholder: theme.extraColors.lightGray } }}
                onChangeText={(text) => setSearchTerm(text)}
                value={searchTerm}
            />
        </View>
    )
}

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
    theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
    fetchSearchArticlesIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchActions.fetchSearchArticlesIfNeeded(domainUrl, searchTerm)),
    invalidateSearchArticles: () => dispatch(searchActions.invalidateSearchArticles()),
    fetchSearchAuthorsIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchAuthorActions.fetchSearchAuthorsIfNeeded(domainUrl, searchTerm)),
    invalidateSearchAuthors: () => dispatch(searchAuthorActions.invalidateSearchAuthors()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar)
