import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Drawer, Colors, Searchbar as PaperSearchBar } from 'react-native-paper'

import { connect } from 'react-redux'

import { getActiveDomain } from '../redux/domains'
import { actions as searchActions } from '../redux/search'

const Searchbar = (props) => {
    const { activeDomain, invalidateSearchArticles, fetchSearchArticlesIfNeeded } = props

    const [searchTerm, setSearchTerm] = useState('')

    const _search = () => {
        invalidateSearchArticles()
        fetchSearchArticlesIfNeeded(activeDomain.url, searchTerm)
        setSearchTerm('')
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <PaperSearchBar
                style={{
                    width: 250,
                    height: 32,
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: 8,
                }}
                inputStyle={{ color: 'white' }}
                iconColor={'white'}
                placeholder='Search Stories'
                onIconPress={_search}
                onSubmitEditing={_search}
                theme={{ colors: { placeholder: 'white' } }}
                onChangeText={(text) => setSearchTerm(text)}
                value={searchTerm}
            />
        </View>
    )
}

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
})

const mapDispatchToProps = (dispatch) => ({
    fetchSearchArticlesIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchActions.fetchSearchArticlesIfNeeded(domainUrl, searchTerm)),
    invalidateSearchArticles: () => dispatch(searchActions.invalidateSearchArticles()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar)
