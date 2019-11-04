import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Platform,
    Image,
    SafeAreaView
} from 'react-native'
import { connect } from 'react-redux'

import { types as globalTypes, actions as globalActions } from '../redux/global'
import { actions as domainsActions } from '../redux/domains'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

import { isPointWithinRadius, getDistance } from 'geolib'

import { List, Divider } from 'react-native-paper'
import Slider from 'react-native-slider'

import * as Amplitude from 'expo-analytics-amplitude'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import * as Sentry from 'sentry-expo'

import InitModal from './InitModal'

const initialState = {
    modalVisible: false,
    selectedDomain: '',
    schoolsInRadius: [],
    radius: 20,
    reloading: false
}

const LocationSelectScreen = props => {
    const {
        navigation,
        availableDomains,
        domains,
        fetchAvailableDomains,
        isLoading,
        error,
        setActiveDomain,
        addDomain
    } = props
    const cityLocation = navigation.getParam('location', null)

    const [state, setState] = useState(initialState)

    useEffect(() => {
        fetchAvailableDomains()
    }, [])

    useEffect(() => {
        _handleRadiusSearch()
    }, [availableDomains])

    const { schoolsInRadius, radius, reloading } = state

    console.log('this is state', state, radius)

    _handleRadiusSearch = () => {
        if (availableDomains.length === 0) {
            return
        }
        const coords = navigation.getParam('coords', {})

        setState({
            ...state,
            reloading: true
        })

        let searchRadius = radius * 1609.34

        // filter schools based on users location and the radius they selected
        const filteredSchools = availableDomains.filter(school => {
            return isPointWithinRadius(
                {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                {
                    latitude: school.latitude,
                    longitude: school.longitude
                },
                searchRadius
            )
        })

        const filteredSchoolsWithDistance = filteredSchools.map(school => {
            let distance = getDistance(
                {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                {
                    latitude: school.latitude,
                    longitude: school.longitude
                }
            )
            school.distanceAway = distance / 1609.34
            return school
        })

        filteredSchoolsWithDistance.sort(function(a, b) {
            if (a.distanceAway < b.distanceAway) return -1
            if (a.distanceAway > b.distanceAway) return 1
            return 0
        })

        setState({
            ...state,
            reloading: false,
            schoolsInRadius: filteredSchoolsWithDistance
        })
    }

    _handleSelect = async (orgId, item) => {
        Haptics.selectionAsync()
        try {
            const found = domains.find(domain => {
                return domain.id == orgId
            })
            // if already added then set as active -- dont save
            if (found) {
                setActiveDomain(orgId)
                navigation.navigate('AuthLoading')
                return
            }
            // save new domain and send analytics
            Amplitude.logEventWithProperties('add school', {
                domainId: orgId
            })

            addDomain({
                id: orgId,
                name: item.school,
                publication: item.publication,
                active: false,
                notificationCategories: [],
                url: item.url
            })

            // set new domain as active
            setActiveDomain(orgId)

            setState({
                ...state,
                modalVisible: true
            })
        } catch (error) {
            console.log('error saving users domain selection', error)
        }
    }

    // dismiss modal and redirect back to auth loading
    // _handleModalDismiss = allNotifications => {
    //     Haptics.selectionAsync()
    //     this.props.dispatch(setAllNotifications(this.state.selectedDomain, allNotifications))
    //     this.props.navigation.navigate('AuthLoading')
    //     this.props.dispatch(clearAvailableDomains())
    //     this.setState({
    //         modalVisible: false,
    //         selectedDomain: ''
    //     })
    // }

    if (isLoading) {
        return (
            <View style={{ flex: 1, padding: 70 }}>
                <ActivityIndicator />
            </View>
        )
    }
    if (availableDomains.length === 0) {
        return (
            <View style={{ padding: 20 }}>
                <Text
                    style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    Sorry, no school's are available
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}
                >
                    Schools within {radius} miles
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}
                >
                    of {cityLocation.city}, {cityLocation.region}
                </Text>
                <Slider
                    value={20}
                    onValueChange={radius => setState({ ...state, radius })}
                    onSlidingComplete={_handleRadiusSearch}
                    minimumValue={5}
                    maximumValue={100}
                    step={5}
                    thumbTintColor={
                        Constants.manifest.releaseChannel === 'sns'
                            ? Constants.manifest.extra.highSchool.primary
                            : Constants.manifest.extra.college.primary
                    }
                    thumbTouchSize={{
                        width: 80,
                        height: 80
                    }}
                />
            </View>
            <Divider />
            {reloading ? (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            ) : schoolsInRadius.length == 0 ? (
                <View style={{ flex: 1, padding: 20 }}>
                    <Text style={{ textAlign: 'center' }}>
                        Sorry there are no schools available within your selected radius
                    </Text>
                </View>
            ) : (
                <ScrollView style={{flex: 1}}>
                    {schoolsInRadius.map(item => {
                        return (
                            item.school && (
                                <View key={item.id}>
                                    <List.Item
                                        title={item.school}
                                        titleEllipsizeMode='tail'
                                        description={`${item.publication}  •  ${item.city}, ${
                                            item.state
                                        }\n${item.distanceAway.toFixed(2)} miles away`}
                                        descriptionEllipsizeMode='tail'
                                        style={{
                                            paddingVertical: 0
                                        }}
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
                                            _handleSelect(item.domain_id, item)
                                            setState({
                                                ...state,
                                                selectedDomain: item.domain_id
                                            })
                                        }}
                                    />
                                    <Divider />
                                </View>
                            )
                        )
                    })}
                    {/* <InitModal
                        modalVisible={this.state.modalVisible}
                        handleDismiss={this._handleModalDismiss}
                        navigation={this.props.navigation}
                    /> */}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

LocationSelectScreen.navigationOptions = {
    title: 'Select Your School'
}


const availableDomainsLoadingSelector = createLoadingSelector([globalTypes.FETCH_AVAILABLE_DOMAINS])
const availableDomainsErrorSelector = createErrorMessageSelector([
    globalTypes.FETCH_AVAILABLE_DOMAINS
])

const mapStateToProps = state => ({
    availableDomains: state.global.availableDomains,
    domains: state.domains,
    isLoading: availableDomainsLoadingSelector(state),
    error: availableDomainsErrorSelector(state)
})

const mapDispatchToProps = dispatch => ({
    fetchAvailableDomains: () => dispatch(globalActions.fetchAvailableDomains()),
    setActiveDomain: domainId => dispatch(domainsActions.setActiveDomain(domainId)),
    addDomain: domain => dispatch(domainsActions.addDomain(domain))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationSelectScreen)
