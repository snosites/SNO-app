import React from 'react';
import {
    Platform,
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    SafeAreaView
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
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled>
                        <View style={styles.container}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/the-source-logo.png')}
                                    style={styles.logoImage}
                                />
                            </View>
                            <View style={styles.getStartedContainer}>
                                <Text style={styles.getStartedText}>Get started by finding your school
                                </Text>
                                {/* <Button
                                    mode="contained"
                                    theme={{
                                        roundness: 7,
                                        colors: {
                                        primary: '#2099CE'
                                    }}}
                                    style={{ padding: 5, marginBottom: 20 }}
                                    onPress={this._handleUseLocation}
                                >
                                    Use Your Current Location
                                </Button> */}
                                <Button
                                    mode="contained"
                                    theme={{
                                        roundness: 7,
                                        colors: {
                                        primary: '#2099CE'
                                    }}}
                                    style={{ padding: 10, marginBottom: 50 }}
                                    onPress={this._handleUseLocation}
                                >
                                    Browse All Schools
                                </Button>
                                {/* <Text>{this.state.errorMessage}</Text> */}
                                <Text style={styles.locationContainerText}>Or enter your school's name below</Text>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        label='School Name'
                                        style={{ width: 300, marginBottom: 20 }}
                                        theme={{
                                            roundness: 7,
                                            colors: {
                                                background: 'white',
                                                primary: '#2099CE'
                                        }}}
                                        mode='outlined'
                                        selectionColor='black'
                                        value={this.state.orgName}
                                        onChangeText={(text) => this.setState({ orgName: text })}
                                    />
                                    <Button
                                        mode="contained"
                                        theme={{
                                            roundness: 7,
                                            colors: {
                                                primary: '#83B33B'
                                        }}}
                                        style={{ padding: 10 }}
                                        onPress={this._handleSubmit}
                                    >
                                        Search
                                </Button>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 30,
        alignItems: 'center'
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
        width: 300
    },
    getStartedText: {
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 20
    },
    locationContainerText: {
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 20
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
    }
});