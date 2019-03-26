import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    AsyncStorage
} from 'react-native';
import { WebBrowser } from 'expo';


export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            userOrg: '',
            userDomain: ''
        }
        this._loadUserSiteAsync();
    }

    _loadUserSiteAsync = async () => {
        const userOrg = await AsyncStorage.getItem('userOrg');
        const userDomain = await AsyncStorage.getItem('userDomain');
        this.setState({
            userOrg,
            userDomain
        })
        
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={require('../assets/images/snologo-dev.png')}
                            style={styles.welcomeImage}
                        />
                    </View>
                    <Text style={styles.textHeading}>{this.state.userOrg}</Text>
                    <Text style={styles.textHeading}>{this.state.userDomain}</Text>
                    <Text style={styles.text}>wordpress blog stuff goes here</Text>
                </ScrollView>

                
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginTop: 3,
    },
    textHeading: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    text: {
        textAlign: 'center',
        fontSize: 17,
        lineHeight: 20,
        paddingBottom: 10
    }
});
