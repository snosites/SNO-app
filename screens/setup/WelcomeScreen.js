import React from 'react'
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
import { StatusBar } from 'expo-status-bar'
import { Button, TextInput } from 'react-native-paper'
import * as Haptics from 'expo-haptics'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import Constants from 'expo-constants'
import { connect } from 'react-redux'

import { actions as globalActions } from '../../redux/global'

import { getReleaseChannel } from '../../constants/config'

const version = getReleaseChannel()

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    state = {
        isLoading: false,
        orgName: '',
        zipCode: '',
        errorMessage: null,
    }

    render() {
        const { errors, navigation, fetchAvailableDomains, domains } = this.props

        const theme = {
            roundness: 7,
            colors: {
                primary:
                    version === 'sns'
                        ? Constants.manifest.extra.highSchool.primary
                        : Constants.manifest.extra.college.primary,
            },
        }

        if (this.state.errorMessage) {
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
                        {this.state.errorMessage}
                    </Text>
                    <Button
                        mode='contained'
                        theme={theme}
                        style={{ padding: 5, marginTop: 50 }}
                        onPress={() => {
                            this.setState({
                                errorMessage: null,
                                isLoading: false,
                            })
                        }}
                    >
                        Go Back
                    </Button>
                </View>
            )
        } else if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingVertical: 40 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style={'dark'} />
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior='position' enabled>
                        <View style={styles.container}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={
                                        version === 'sns'
                                            ? require('../assets/images/the-source-logo.png')
                                            : require('../assets/images/cns-logo.png')
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
                                    onPress={this._handleUseLocation}
                                >
                                    Use Current Location
                                </Button>
                                <Button
                                    mode='contained'
                                    theme={theme}
                                    style={{ padding: 10, marginBottom: 50, width: 300 }}
                                    onPress={this._handleBrowse}
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
                                                primary:
                                                    version === 'sns'
                                                        ? Constants.manifest.extra.highSchool
                                                              .primary
                                                        : Constants.manifest.extra.college.primary,
                                                background: 'white',
                                            },
                                        }}
                                        mode='outlined'
                                        selectionColor='black'
                                        returnKeyType='search'
                                        value={this.state.orgName}
                                        onChangeText={(text) => this.setState({ orgName: text })}
                                        onSubmitEditing={this._handleSubmit}
                                    />
                                    <Button
                                        mode='contained'
                                        theme={{
                                            roundness: 7,
                                            colors: {
                                                primary:
                                                    version === 'sns'
                                                        ? Constants.manifest.extra.highSchool
                                                              .secondary
                                                        : Constants.manifest.extra.college
                                                              .secondary,
                                            },
                                        }}
                                        style={{ padding: 10, width: 300 }}
                                        onPress={this._handleSubmit}
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
                                            // colors: {
                                            //     primary:
                                            //         version === 'sns'
                                            //             ? Constants.manifest.extra.highSchool.secondary
                                            //             : Constants.manifest.extra.college.secondary,
                                            // },
                                        }}
                                        style={{ padding: 10, width: 300, marginTop: 20 }}
                                        onPress={() => navigation.navigate('AuthLoading')}
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

    _handleSubmit = () => {
        this.props.navigation.navigate('Select', { searchTerm: this.state.orgName })
    }

    _handleBrowse = () => {
        this.props.navigation.navigate('Select')
    }

    _handleUseLocation = () => {
        Haptics.selectionAsync()
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage:
                    'Oops, this will not work on Sketch in an Android emulator. Try it on your device',
            })
        } else {
            this._getLocationAsync()
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION)
        if (status !== 'granted') {
            this.setState({
                errorMessage:
                    'Permission to access location was denied, please select a school using a different method',
            })
            return
        }
        this.setState({
            isLoading: true,
        })

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
        this.props.navigation.navigate('LocationSelect', {
            location: cityLocation[0],
            coords: locationObj,
        })
        this.setState({
            isLoading: false,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 20,
    },
    locationContainerText: {
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
    errors: state.errors,
    domains: state.domains,
})

const mapDispatchToProps = (dispatch) => ({
    fetchAvailableDomains: () => dispatch(globalActions.fetchAvailableDomains()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)
