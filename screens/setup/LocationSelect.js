import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Platform,
    Image,
    SafeAreaView,
} from 'react-native'

import { isPointWithinRadius, getDistance } from 'geolib'

import { List, Divider } from 'react-native-paper'
import Slider from 'react-native-slider'

import * as Amplitude from 'expo-analytics-amplitude'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import * as Sentry from 'sentry-expo'

import InitModal from './InitModal'

import { getReleaseChannel } from '../../constants/config'

const version = getReleaseChannel()

const LocationSelectScreen = (props) => {
    const {
        route,
        navigation,
        availableDomains,
        domains,
        fetchAvailableDomains,
        isLoading,
        error,
        setActiveDomain,
        addDomain,
        clearAvailableDomains,
        setSubscribeAll,
        addSchoolSub,
    } = props

    const cityLocation = route.params ? route.params.location : null

    const [modalVisible, setModalVisible] = useState(false)
    const [schoolsInRadius, setSchoolsInRadius] = useState([])
    const [radius, setRadius] = useState(20)
    const [reloading, setReloading] = useState(false)

    const [selectedDomain, setSelectedDomain] = useState(null)

    useEffect(() => {
        if (selectedDomain) {
            _handleSelect()
        }
    }, [selectedDomain])

    useEffect(() => {
        fetchAvailableDomains()
    }, [])

    useEffect(() => {
        _handleRadiusSearch()
    }, [availableDomains])

    _handleRadiusSearch = () => {
        if (availableDomains.length === 0) {
            return
        }
        const coords = route.params.coords

        setReloading(true)

        let searchRadius = radius * 1609.34

        // filter schools based on users location and the radius they selected
        const filteredSchools = availableDomains.filter((school) => {
            return isPointWithinRadius(
                {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                },
                {
                    latitude: school.latitude,
                    longitude: school.longitude,
                },
                searchRadius
            )
        })

        const filteredSchoolsWithDistance = filteredSchools.map((school) => {
            let distance = getDistance(
                {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                },
                {
                    latitude: school.latitude,
                    longitude: school.longitude,
                }
            )
            school.distanceAway = distance / 1609.34
            return school
        })

        filteredSchoolsWithDistance.sort(function (a, b) {
            if (a.distanceAway < b.distanceAway) return -1
            if (a.distanceAway > b.distanceAway) return 1
            return 0
        })

        setReloading(false)
        setSchoolsInRadius(filteredSchoolsWithDistance)
    }

    _handleSelect = async () => {
        Haptics.selectionAsync()
        try {
            const found = domains.find((domain) => {
                return domain.id == selectedDomain.id
            })
            // if already added then set as active -- dont save
            if (found) {
                setActiveDomain(selectedDomain.id)
                return
            }
            // save new domain and send analytics
            Amplitude.logEventWithProperties('add school', {
                domainId: selectedDomain.id,
            })

            //new analytics
            addSchoolSub(selectedDomain.url)

            addDomain({
                id: selectedDomain.id,
                name: selectedDomain.school,
                publication: selectedDomain.publication,
                active: false,
                notificationCategories: [],
                url: selectedDomain.url,
            })

            setModalVisible(true)
        } catch (error) {
            console.log('error saving users domain selection', error)
        }
    }

    // dismiss modal and redirect back to auth loading
    _handleModalDismiss = (allNotifications) => {
        Haptics.selectionAsync()
        setSubscribeAll(allNotifications)

        setModalVisible(false)
        clearAvailableDomains()

        setActiveDomain(selectedDomain.id)
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, paddingVertical: 70 }}>
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
                        textAlign: 'center',
                    }}
                >
                    Sorry, no schools are available
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text
                    style={{
                        fontFamily: 'openSansBold',
                        textAlign: 'center',
                        fontSize: 18,
                        // fontWeight: 'bold',
                    }}
                >
                    Schools within {radius} miles
                </Text>
                <Text
                    style={{
                        fontFamily: 'openSansBold',
                        textAlign: 'center',
                        fontSize: 18,
                    }}
                >
                    of {cityLocation.city}, {cityLocation.region}
                </Text>
                <Slider
                    value={20}
                    onValueChange={(radius) => setRadius(radius)}
                    onSlidingComplete={_handleRadiusSearch}
                    minimumValue={5}
                    maximumValue={100}
                    step={5}
                    thumbTintColor={
                        version === 'sns'
                            ? Constants.manifest.extra.highSchool.primary
                            : Constants.manifest.extra.college.primary
                    }
                    thumbTouchSize={{
                        width: 80,
                        height: 80,
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
                <ScrollView style={{ flex: 1 }}>
                    {schoolsInRadius.map((item) => {
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
                                            paddingVertical: 0,
                                        }}
                                        left={(props) => {
                                            if (item.icon) {
                                                return (
                                                    <List.Icon
                                                        {...props}
                                                        icon={({ size, color }) => (
                                                            <Image
                                                                source={{
                                                                    uri: item.icon,
                                                                }}
                                                                style={{
                                                                    width: size + 5,
                                                                    height: size + 5,
                                                                    borderRadius: 4,
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
                                            setSelectedDomain(item)
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
            )}
        </SafeAreaView>
    )
}

export default LocationSelectScreen
