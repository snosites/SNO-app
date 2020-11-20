import React, { useState } from 'react'
import { ScrollView, View, Text, Modal, SafeAreaView, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'
import { connect } from 'react-redux'
import { Button, List, Divider } from 'react-native-paper'
import { actions as domainActions } from '../redux/domains'

const ErrorScreen = (props) => {
    const { route, navigation, domains, setActiveDomain } = props

    const errorMessage = route.params?.errorMessage

    const [modalVisible, setModalVisible] = useState(false)

    _handleSelectActive = () => {
        setModalVisible(true)
    }

    _handleSelect = async (id) => {
        try {
            Haptics.selectionAsync()
            setActiveDomain(id)
            setModalVisible(false)

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        } catch (error) {
            console.log('error selecting school from error page')
            setModalVisible(false)

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <StatusBar style='dark' />
            <Text
                style={{
                    textAlign: 'center',
                    padding: 20,
                    paddingVertical: 50,
                    fontSize: 20,
                    fontFamily: 'ralewayBold',
                }}
            >
                {errorMessage}
            </Text>
            <Button
                mode='contained'
                theme={{
                    roundness: 7,
                    colors: {
                        primary: '#2099CE',
                    },
                }}
                style={{ padding: 5, marginBottom: 20 }}
                onPress={() => setActiveDomain(null)}
            >
                Select a New School
            </Button>
            <Text style={{ fontFamily: 'ralewayBold', textAlign: 'center', paddingBottom: 20 }}>
                Or
            </Text>
            <Button
                mode='contained'
                theme={{
                    roundness: 7,
                    colors: {
                        primary: '#2099CE',
                    },
                }}
                style={{ padding: 5 }}
                onPress={_handleSelectActive}
            >
                Choose From Your Saved Schools
            </Button>
            <Modal
                animationType='slide'
                presentationStyle='fullScreen'
                transparent={false}
                visible={modalVisible}
            >
                <SafeAreaView style={{ flex: 1, padding: 0, backgroundColor: '#f6f6f6' }}>
                    <ScrollView>
                        {domains.map((item) => {
                            return (
                                <View key={item.id}>
                                    <List.Item
                                        title={item.name}
                                        style={{ paddingVertical: 0 }}
                                        left={(props) => (
                                            <List.Icon {...props} icon='chevron-right' />
                                        )}
                                        onPress={() => _handleSelect(item.id)}
                                    />
                                    <Divider />
                                </View>
                            )
                        })}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    domains: state.domains,
})

const mapDispatchToProps = (dispatch) => ({
    setActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorScreen)
