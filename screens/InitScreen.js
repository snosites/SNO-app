import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button, colors, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';


export default class InitScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state={
        zipCode: ''
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
                    <Text style={styles.getStartedText}>Get started by entering your zip code below
                    </Text>
                </View>
                <View style={styles.locationContainer}>
                    <Input
                        inputStyle={{borderWidth: 1.25, borderColor: '#D17931', borderRadius: 10, paddingHorizontal: 20}}
                        inputContainerStyle={{ borderBottomWidth: 0}}
                        value={this.state.zipCode}
                        placeholder='Zip Code'
                        onChangeText={(text) => this.setState({zipCode: text})}
                        onSubmitEditing={(text) => this._handleZipSubmit(text)}
                    />
                    <Text style={styles.locationContainerText}>Or</Text>
                    <Button
                        title='Use Your Current Location'
                        type='outline'
                        buttonStyle={{ borderWidth: 1.25, borderColor: '#9A1D20', borderRadius: 10, paddingHorizontal: 30}}
                        onPress={this._handleUseLocation}
                        titleStyle={{color: '#9A1D20'}}
                    />
                    
                    
                </View>
            </View>
        );
    }

    _handleZipSubmit = text => {
        console.log(this.state);
    }
    _handleUseLocation = () => {
        console.log('hello');
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 30
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
        marginTop: 50,
        alignItems: 'center'
    },
    locationContainerText: {
        fontSize: 19,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
        margin: 20
    }
});