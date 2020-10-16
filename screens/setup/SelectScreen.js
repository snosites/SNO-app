import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, View, Text, Image } from 'react-native'

import { List, Divider } from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Haptics from 'expo-haptics'

import InitModal from './InitModal'

const SelectScreen = (props) => {
    const {
        route,
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
        error,
        addSchoolSub,
    } = props

    const searchTerm = route.params && route.params.searchTerm

    useEffect(() => {
        if (searchTerm) {
            searchAvailableDomains(searchTerm)
        } else {
            fetchAvailableDomains()
        }
    }, [searchTerm])

    const [modalVisible, setModalVisible] = useState(false)

    _handleSelect = async (selectedDomain) => {
        console.log('this is selected domain', selectedDomain)
        Haptics.selectionAsync()
        try {
            const found = domains.find((domain) => {
                return domain.id == selectedDomain.id
            })
            // if already added then set as active -- dont save
            if (found) {
                setActiveDomain(selectedDomain.id)
                navigation.navigate('Auth')
                return
            }

            // send old analytic
            Amplitude.logEventWithProperties('add school', {
                domainId: selectedDomain.id,
            })
            //send new analytic
            addSchoolSub(selectedDomain.url)

            addDomain({
                id: selectedDomain.id,
                name: selectedDomain.school,
                publication: selectedDomain.publication,
                active: false,
                notificationCategories: [],
                url: selectedDomain.url,
            })

            // set new domain as active
            setActiveDomain(selectedDomain.id)

            setModalVisible(true)
        } catch (error) {
            console.log('error saving users school', error)
        }
    }

    // dismiss modal and redirect back to auth loading
    _handleModalDismiss = (allNotifications) => {
        Haptics.selectionAsync()
        setSubscribeAll(allNotifications)
        navigation.navigate('Auth')

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
                    paddingHorizontal: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#424242',
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
                        textAlign: 'center',
                    }}
                >
                    Sorry no schools match that search term, please try searching again.
                </Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {availableDomains.map((item) => {
                return (
                    item.school && (
                        <View key={item.id}>
                            <List.Item
                                title={item.school}
                                titleEllipsizeMode='tail'
                                description={`${item.publication}  •  ${item.city}, ${item.state}`}
                                descriptionEllipsizeMode='tail'
                                style={{ paddingVertical: 0 }}
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
    title: 'Select Your School',
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})

export default SelectScreen
