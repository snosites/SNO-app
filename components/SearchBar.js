import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Drawer, Colors, Searchbar as PaperSearchBar } from 'react-native-paper'

import { connect } from 'react-redux'

import { getActiveDomain } from '../redux/domains'
import { actions as searchActions } from '../redux/search'

const Searchbar = (props) => {
    const {
        placeholder,
        theme,
        activeDomain,
        invalidateSearchArticles,
        fetchSearchArticlesIfNeeded,
        authors = false,
    } = props

    const [searchTerm, setSearchTerm] = useState('')

    const _search = () => {
        if (authors) _searchAuthors()
        else _searchArticles()
    }

    const _searchArticles = () => {
        invalidateSearchArticles()
        fetchSearchArticlesIfNeeded(activeDomain.url, searchTerm)
        setSearchTerm('')
    }

    const _searchAuthors = () => {
        // invalidateSearchArticles()
        // fetchSearchArticlesIfNeeded(activeDomain.url, searchTerm)
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar)
