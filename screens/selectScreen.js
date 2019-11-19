import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Platform,
    Image
} from 'react-native'
import { connect } from 'react-redux'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as domainsActions } from '../redux/domains'
import { types as userTypes, actions as userActions } from '../redux/user'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

import { List, Divider } from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import * as Sentry from 'sentry-expo'

import InitModal from './InitModal'

import { getReleaseChannel } from '../constants/config'

const version = getReleaseChannel()

const theme = {
    roundness: 7,
    colors: {
        primary:
            version === 'sns'
                ? Constants.manifest.extra.highSchool.primary
                : Constants.manifest.extra.college.primary
    }
}

const SelectScreen = props => {
    const {
        navigation,
        availableDomains,
        domains,
        fetchAvailableDomains,
        searchAvailableDomains,
        clearAvailableDomains,
        setActiveDomain,
        setSubscribeAll,
        addDomain,
        isLoading,
        error
    } = props

    useEffect(() => {
        const searchTerm = navigation.getParam('searchTerm', null)
        if (searchTerm) {
            searchAvailableDomains(searchTerm)
        } else {
            fetchAvailableDomains()
        }
    }, [])

    const [modalVisible, setModalVisible] = useState(false)

    _handleSelect = async selectedDomain => {
        console.log('this is selected domain', selectedDomain)
        Haptics.selectionAsync()
        try {
            const found = domains.find(domain => {
                return domain.id == selectedDomain.id
            })
            // if already added then set as active -- dont save
            if (found) {
                setActiveDomain(selectedDomain.id)
                navigation.navigate('AuthLoading')
                return
            }
            // save new domain and send analytics
            Amplitude.logEventWithProperties('add school', {
                domainId: selectedDomain.id
            })

            addDomain({
                id: selectedDomain.id,
                name: selectedDomain.school,
                publication: selectedDomain.publication,
                active: false,
                notificationCategories: [],
                url: selectedDomain.url
            })

            // set new domain as active
            setActiveDomain(selectedDomain.id)

            setModalVisible(true)
        } catch (error) {
            console.log('error saving users org', error)
        }
    }

    // dismiss modal and redirect back to auth loading
    _handleModalDismiss = allNotifications => {
        Haptics.selectionAsync()
        setSubscribeAll(allNotifications)
        navigation.navigate('AuthLoading')
        
        setModalVisible(false)
        clearAvailableDomains()
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20
                }}
            >
                <Text
                    style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#424242'
                    }}
                >
                    Sorry, there was a problem loading the schools. Please try again.
                </Text>
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, padding: 70 }}>
                <ActivityIndicator />
            </View>
        )
    }
    if (availableDomains.length == 0) {
        return (
            <View style={{ padding: 20 }}>
                <Text
                    style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    Sorry no school's match that search term, please try searching again.
                </Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {availableDomains.map(item => {
                return (
                    item.school && (
                        <View key={item.id}>
                            <List.Item
                                title={item.school}
                                titleEllipsizeMode='tail'
                                description={`${item.publication}  •  ${item.city}, ${item.state}`}
                                descriptionEllipsizeMode='tail'
                                style={{ paddingVertical: 0 }}
                                left={props => {
                                    if (item.icon) {
                                        return (
                                            <List.Icon
                                                {...props}
                                                icon={({ size, color }) => (
                                                    <Image
                                                        source={{
                                                            uri: item.icon
                                                        }}
                                                        style={{
                                                            width: size + 5,
                                                            height: size + 5,
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                )}
                                            />
                                        )
                                    } else {
                                        return <List.Icon {...props} icon='chevron-right' />
                                    }
                                }}
                                onPress={() => {
                                    _handleSelect(item)
                                }}
                            />
                            <Divider />
                        </View>
                    )
                )
            })}
            <InitModal
                modalVisible={modalVisible}
                handleDismiss={_handleModalDismiss}
                navigation={navigation}
            />
        </ScrollView>
    )
}

SelectScreen.navigationOptions = {
    title: 'Select Your School'
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})

const availableDomainsLoadingSelector = createLoadingSelector([
    globalTypes.FETCH_AVAILABLE_DOMAINS,
    globalTypes.SEARCH_AVAILABLE_DOMAINS
])
const availableDomainsErrorSelector = createErrorMessageSelector([
    globalTypes.FETCH_AVAILABLE_DOMAINS,
    globalTypes.SEARCH_AVAILABLE_DOMAINS
])

const mapStateToProps = state => ({
    availableDomains: state.global.availableDomains,
    domains: state.domains,
    isLoading: availableDomainsLoadingSelector(state),
    error: availableDomainsErrorSelector(state)
})

const mapDispatchToProps = dispatch => ({
    fetchAvailableDomains: () => dispatch(globalActions.fetchAvailableDomains()),
    searchAvailableDomains: searchTerm =>
        dispatch(globalActions.searchAvailableDomains(searchTerm)),
    setActiveDomain: domainId => dispatch(domainsActions.setActiveDomain(domainId)),
    addDomain: domain => dispatch(domainsActions.addDomain(domain)),
    clearAvailableDomains: () => dispatch(globalActions.clearAvailableDomains()),
    setSubscribeAll: payload => dispatch(userActions.setSubscribeAll(payload))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectScreen)
