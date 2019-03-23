import React from 'react';
import {
    Platform,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import { Button, colors, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

import { secrets } from '../env';

console.log(secrets.CAPSULEBEARER);

export default class InitScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        zipCode: '',
        location: null,
        cityLocation: null,
        errorMessage: null,
    }

    render() {
        return (
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
                        title='Use Your Current Location'
                        type='outline'
                        buttonStyle={{ width: 300, borderWidth: 1.25, borderColor: '#9A1D20', borderRadius: 10, paddingHorizontal: 30 }}
                        onPress={this._handleUseLocation}
                        titleStyle={{ color: '#9A1D20' }}
                    />
                    <Text>{this.state.errorMessage}</Text>
                    <Text style={styles.locationContainerText}>Or enter your organization's name and zip code below</Text>
                    {/* <Text>{JSON.stringify(this.state.cityLocation)}</Text> */}
                    <View style={styles.formContainer}>
                        <Input
                            inputStyle={{borderWidth: 1.25, borderColor: '#D17931', borderRadius: 10, paddingHorizontal: 20}}
                            inputContainerStyle={{ width: 300, borderBottomWidth: 0}}
                            value={this.state.zipCode}
                            placeholder='Organization Name'
                            onChangeText={(text) => this.setState({ zipCode: text })}
                            onSubmitEditing={(text) => this._handleZipSubmit(text)}
                        />
                        <Input
                            inputStyle={{borderWidth: 1.25, borderColor: '#D17931', borderRadius: 10, paddingHorizontal: 20}}
                            inputContainerStyle={{ width: 300, borderBottomWidth: 0, marginVertical: 10 }}
                            value={this.state.zipCode}
                            placeholder='Zip Code'
                            onChangeText={(text) => this.setState({ zipCode: text })}
                            onSubmitEditing={(text) => this._handleZipSubmit(text)}
                        />
                        <Button
                            title='Search'
                            buttonStyle={{ backgroundColor: '#9A1D20', borderRadius: 10, paddingHorizontal: 30 }}
                            onPress={this._handleUseLocation}
                            titleStyle={{ color: 'white' }}
                            />
                    </View>
                    
                </View>
            </View>
        );
    }

    _handleZipSubmit = text => {
        console.log(this.state);
    }
    _handleUseLocation = () => {
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
        let location = await Location.getCurrentPositionAsync({});
        let locationObj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
        let cityLocation = await Location.reverseGeocodeAsync(locationObj);

        this.setState({ cityLocation });
    }

}

const styles = StyleSheet.create({
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