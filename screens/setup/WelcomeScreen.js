import React, { useState } from 'react'
import {
    Platform,
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    SafeAreaView,
} from 'react-native'
import { connect } from 'react-redux'
import { StatusBar } from 'expo-status-bar'
import { Button, TextInput } from 'react-native-paper'
import * as Haptics from 'expo-haptics'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import Constants from 'expo-constants'

import { getReleaseChannel } from '../../constants/config'

const version = getReleaseChannel()

const theme = {
    roundness: 7,
    colors: {
        primary:
            version === 'sns'
                ? Constants.manifest.extra.highSchool.primary
                : Constants.manifest.extra.college.primary,
    },
}

const WelcomeScreen = (props) => {
    const { navigation, domains } = props

    const [loading, setLoading] = useState(false)
    const [schoolName, setSchoolName] = useState('')
    // const [zipcode, setZipcode] = useState('')
    const [error, setError] = useState(null)

    _handleSubmit = () => {
        navigation.navigate('Select', { searchTerm: schoolName })
    }

    _handleBrowse = () => {
        navigation.navigate('Select')
    }

    _handleUseLocation = () => {
        Haptics.selectionAsync()
        if (Platform.OS === 'android' && !Constants.isDevice) {
            setError(
                'Oops, this will not work on Sketch in an Android emulator. Try it on your device'
            )
        } else {
            _getLocationAsync()
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION)
        if (status !== 'granted') {
            setError(
                'Permission to access location was denied, please select a school using a different method'
            )
            return
        }
        setLoading(true)

        let location = await Location.getCurrentPositionAsync({})

        let locationObj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }

        let cityLocation = await Location.reverseGeocodeAsync(locationObj)

        if (cityLocation && cityLocation[0]) {
        } else {
            cityLocation = []
        }
        navigation.navigate('LocationSelect', {
            location: cityLocation[0],
            coords: locationObj,
        })
        setLoading(false)
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
                    {error}
                </Text>
                <Button
                    mode='contained'
                    theme={theme}
                    style={{ padding: 5, marginTop: 50 }}
                    onPress={() => {
                        setError(null)
                        setLoading(false)
                    }}
                >
                    Go Back
                </Button>
            </View>
        )
    } else if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 100 }}>
                <ActivityIndicator />
            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style={'dark'} />
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='position' enabled>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={
                                    version === 'sns'
                                        ? require('../../assets/images/the-source-logo.png')
                                        : require('../../assets/images/cns-logo.png')
                                }
                                style={styles.logoImage}
                            />
                        </View>
                        <View style={styles.getStartedContainer}>
                            <Text style={styles.getStartedText}>
                                Get started by finding your school
                            </Text>
                            <Button
                                mode='contained'
                                theme={theme}
                                style={{ padding: 10, marginBottom: 30, width: 300 }}
                                onPress={_handleUseLocation}
                            >
                                Use Current Location
                            </Button>
                            <Button
                                mode='contained'
                                theme={theme}
                                style={{ padding: 10, marginBottom: 50, width: 300 }}
                                onPress={_handleBrowse}
                            >
                                Browse All Schools
                            </Button>
                            <Text style={styles.locationContainerText}>
                                Or search for a school below
                            </Text>
                            <View style={styles.formContainer}>
                                <TextInput
                                    label='School Name'
                                    style={{ width: 300, marginBottom: 20 }}
                                    theme={{
                                        ...theme,
                                        colors: {
                                            primary: theme.colors.primary,
                                            background: 'white',
                                        },
                                    }}
                                    mode='outlined'
                                    selectionColor='black'
                                    returnKeyType='search'
                                    value={schoolName}
                                    onChangeText={(text) => setSchoolName(text)}
                                    onSubmitEditing={_handleSubmit}
                                />
                                <Button
                                    mode='contained'
                                    theme={theme}
                                    style={{ padding: 10, width: 300 }}
                                    onPress={_handleSubmit}
                                >
                                    Search
                                </Button>
                            </View>
                            {domains.length ? (
                                <Button
                                    mode='text'
                                    color='black'
                                    theme={{
                                        roundness: 7,
                                    }}
                                    style={{ padding: 10, width: 300, marginTop: 20 }}
                                    onPress={() => navigation.navigate('Auth')}
                                >
                                    Go Back
                                </Button>
                            ) : null}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ccc',
        margin: 30,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    logoImage: {
        width: 250,
        height: 100,
        resizeMode: 'contain',
    },
    getStartedContainer: {
        flex: 1,
        alignItems: 'center',
        width: 300,
    },
    getStartedText: {
        fontFamily: 'openSans',
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 20,
    },
    locationContainerText: {
        fontFamily: 'openSans',
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
    },
})

const mapStateToProps = (state) => ({
    domains: state.domains,
})

export default connect(mapStateToProps)(WelcomeScreen)
