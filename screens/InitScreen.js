import React from 'react';
import {
    Platform,
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Constants, Location, Permissions, Haptic } from 'expo';



export default class InitScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        isLoading: false,
        orgName: '',
        zipCode: '',
        cityLocation: null,
        errorMessage: null,
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingVertical: 40 }}>
                    <ActivityIndicator color="#9A1D20" />
                </View>
            )
        }
        return (
            <ScrollView>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../assets/images/snologo-dev.png')}
                                style={styles.logoImage}
                            />
                        </View>
                        <View style={styles.getStartedContainer}>
                            <Text style={styles.getStartedText}>Get started by finding your organization
                        </Text>
                        </View>
                        <View style={styles.locationContainer}>
                            <Button
                                mode="contained"
                                style={{  color: 'white', backgroundColor: '#9A1D20', borderRadius: 10, padding: 5 }}
                                onPress={this._handleUseLocation}
                            >
                                Use Your Current Location
                            </Button>
                            <Text>{this.state.errorMessage}</Text>
                            <Text style={styles.locationContainerText}>Or enter your organization's name below</Text>
                            <View style={styles.formContainer}>
                                <TextInput
                                    label='Organization Name'
                                    style={{ width: 300, paddingHorizontal: 20 }}
                                    theme={{ roundness: 10 }}
                                    mode='outlined'
                                    value={this.state.orgName}
                                    onChangeText={(text) => this.setState({ orgName: text })}
                                />
                                <Button
                                    mode="contained"
                                    style={{ color: 'white', backgroundColor: '#9A1D20', borderRadius: 10, padding: 5 }}
                                    onPress={this._handleSubmit}
                                >
                                    Search
                                </Button>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }

    _handleSubmit = text => {
        console.log(this.state);
        this.props.navigation.navigate('Select', {
            orgName: this.state.orgName
        })
    }

    _handleUseLocation = () => {
        Haptic.selection();
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied, please enter information manually',
            });
        }
        this.setState({
            isLoading: true
        })
        let location = await Location.getCurrentPositionAsync({});
        // console.log('location obj', location)
        let locationObj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
        let cityLocation = await Location.reverseGeocodeAsync(locationObj);
        // console.log('city location', cityLocation)
        this.setState({ cityLocation });
        this.props.navigation.navigate('Select', {
            location: this.state.cityLocation
        })
        this.setState({
            isLoading: false
        })
    }

}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 0,
        paddingTop: 30,
    },
    logoImage: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginTop: 3,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
        marginBottom: 100
    },
    getStartedText: {
        fontSize: 19,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    locationContainer: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
    locationContainerText: {
        fontSize: 19,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
        margin: 20
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
    }
});