import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, FlatList, ActivityIndicator, View, Text, Image } from 'react-native'
import Color from 'color'
import { connect } from 'react-redux'

import { List, Divider } from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Haptics from 'expo-haptics'

import InitModal from './InitModal'

const SelectScreen = (props) => {
    const {
        route,
        navigation,
        theme,
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
    const schoolId = route.params && route.params.schoolId

    const [selectedDomain, setSelectedDomain] = useState(null)
    const [modalVisible, setModalVisible] = useState(null)
    const [linkedSchoolIndex, setLinkedSchoolIndex] = useState(null)

    const flatListRef = useRef(null)

    useEffect(() => {
        if (searchTerm) {
            searchAvailableDomains(searchTerm)
        } else {
            fetchAvailableDomains()
        }
    }, [searchTerm])

    useEffect(() => {
        if (schoolId && availableDomains.length) {
            const linkedDomainIndex = availableDomains.findIndex((domain) => domain.id == schoolId)

            if (linkedDomainIndex > 1) {
                console.log('linkedDomainIndex', linkedDomainIndex)
                // setSelectedDomain(foundDomain)
                flatListRef.current?.scrollToIndex({
                    index: linkedDomainIndex > 5 ? linkedDomainIndex - 5 : linkedDomainIndex,
                    viewPosition: 0.5,
                    // viewOffset: 0,
                })
            } else {
                console.log('no school matches ID passed')
            }
        }
    }, [schoolId, availableDomains, flatListRef.current])

    useEffect(() => {
        if (selectedDomain) {
            _handleSelect()
        }
    }, [selectedDomain])

    const _handleSelect = async () => {
        console.log('this is selected domain', selectedDomain)
        Haptics.selectionAsync()
        try {
            const found = domains.find((domain) => {
                return domain.id == selectedDomain.id
            })
            // if already added then set as active -- dont save
            if (found) {
                console.log('this domain is already saved', found)
                setActiveDomain(selectedDomain.id)

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

            setModalVisible(true)
        } catch (error) {
            console.log('error saving users school', error)
        }
    }

    // dismiss modal and redirect back to auth loading
    const _handleModalDismiss = (allNotifications) => {
        Haptics.selectionAsync()
        setSubscribeAll(allNotifications)
        // navigation.navigate('Auth')

        setModalVisible(false)
        clearAvailableDomains()
        // set new domain as active
        setActiveDomain(selectedDomain.id)
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

    const ITEM_HEIGHT = 60

    return (
        <>
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={availableDomains}
                keyExtractor={(item) => item.id.toString()}
                ref={flatListRef}
                getItemLayout={(data, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                renderItem={({ item, index, separators }) => {
                    let linkStyle = { height: ITEM_HEIGHT, justifyContent: 'center' }
                    let secondShadow = {}
                    const shadowColor = Color('#08c70b')
                    if (schoolId && schoolId == item.id) {
                        linkStyle = {
                            height: ITEM_HEIGHT,
                            justifyContent: 'center',
                            shadowColor,
                            shadowOffset: {
                                width: 7,
                                height: 7,
                            },
                            shadowOpacity: 0.91,
                            shadowRadius: 9.11,
                            elevation: 14,
                            backgroundColor: theme.colors.background,
                            borderRadius: 8,
                        }
                        secondShadow = {
                            flex: 1,
                            justifyContent: 'center',
                            shadowColor,
                            shadowOffset: {
                                width: -7,
                                height: -7,
                            },
                            shadowOpacity: 0.91,
                            shadowRadius: 9.11,
                            elevation: 14,
                            backgroundColor: theme.colors.background,
                            borderRadius: 8,
                        }
                    }
                    return (
                        <View key={item.id} style={linkStyle}>
                            <View style={secondShadow}>
                                <List.Item
                                    title={item.school}
                                    titleEllipsizeMode='tail'
                                    description={`${item.publication}  •  ${item.city}, ${item.state}`}
                                    descriptionEllipsizeMode='tail'
                                    style={{}}
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
                        </View>
                    )
                }}
                // ItemSeparatorComponent={() => (
                //     <View style={{ height: 0, backgroundColor: theme.colors.surface }} />
                // )}
                ListEmptyComponent={() => (
                    <View>
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 18,
                                textAlign: 'center',
                                padding: 20,
                                color: theme.colors.text,
                            }}
                        >
                            Sorry no schools match that search term, please try searching again.
                        </Text>
                    </View>
                )}
            />
            <InitModal
                modalVisible={modalVisible}
                handleDismiss={_handleModalDismiss}
                navigation={navigation}
            />
        </>
    )
}

export default SelectScreen
