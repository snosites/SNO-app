import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class InitScreen extends React.Component {
    static navigationOptions = {
        header: null,
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

                    <View style={styles.getStartedContainer}>
                        <Text style={styles.getStartedText}>Get started by selecting your newspaper
                        </Text>
                    </View>
                    <View style={styles.startContainer}>
                        <TouchableOpacity onPress={this._handleHelpPress} style={styles.useLocationButton}>
                            <Text style={styles.useLocationButtonText}>Use your current location</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // _maybeRenderDevelopmentModeWarning() {
    //     if (__DEV__) {
    //         const learnMoreButton = (
    //             <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
    //                 Learn more
    //             </Text>
    //         );

    //         return (
    //             <Text style={styles.developmentModeText}>
    //                 Development mode is enabled, your app will be slower but you can use useful development
    //                 tools. {learnMoreButton}
    //             </Text>
    //         );
    //     } else {
    //         return (
    //             <Text style={styles.developmentModeText}>
    //                 You are not in development mode, your app will run at full speed.
    //     </Text>
    //         );
    //     }
    // }

    // _handleLearnMorePress = () => {
    //     WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
    // };

    // _handleHelpPress = () => {
    //     WebBrowser.openBrowserAsync(
    //         'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    //     );
    // };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
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
    // tabBarInfoContainer: {
    //     position: 'absolute',
    //     bottom: 0,
    //     left: 0,
    //     right: 0,
    //     ...Platform.select({
    //         ios: {
    //             shadowColor: 'black',
    //             shadowOffset: { height: -3 },
    //             shadowOpacity: 0.1,
    //             shadowRadius: 3,
    //         },
    //         android: {
    //             elevation: 20,
    //         },
    //     }),
    //     alignItems: 'center',
    //     backgroundColor: '#fbfbfb',
    //     paddingVertical: 20,
    // },
    startContainer: {
        marginTop: 45,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    useLocationButtonText: {
        fontSize: 17,
        color: '#fff',
    },
    useLocationButton: {
        backgroundColor: '#471513',
        borderRadius: 7,
        padding: 10,
        paddingHorizontal: 20
    }
});