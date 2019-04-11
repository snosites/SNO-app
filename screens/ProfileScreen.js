import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

import { WebBrowser } from 'expo';

import HTML from 'react-native-render-html';
import Colors from '../constants/Colors';
import { NavigationEvents } from 'react-navigation';

export default class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile' //navigation.getParam('menuTitle', 'Stories'),
        };
    };

    state = {
        articlesByWriter =[]
    }

    render() {
        const { navigation } = this.props;
        const profile = navigation.getParam('profile', 'loading');
        return (
            <ScrollView style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => this._loadProfile(payload)}
                />
                {profile == 'loading' ?
                    <View style={{ flex: 1, paddingTop: 20, alignItems: 'center' }}>
                        <ActivityIndicator />
                    </View>
                    :
                    profile == 'none' ?
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Image
                                style={styles.profileImage}
                                source={require('../assets/images/anon.png')}
                            />
                            <Text style={{ fontSize: 35, textAlign: 'center', paddingVertical: 20 }}>
                                This person does not appear to have a profile page
                            </Text>
                        </View>
                        :
                        <View style={styles.profileInfoContainer}>
                            <View style={styles.profileImageContainer}>
                                {this._renderProfileImage(profile)}
                            </View>
                            <Text style={styles.title}>{profile.title.rendered}</Text>
                            <Text style={styles.position}>{profile.custom_fields.staffposition[0]}</Text>
                            <HTML
                                html={profile.content.rendered}
                                textSelectable={true}
                                containerStyle={styles.textContainer}
                                onLinkPress={(e, href) => this._viewLink(href)}
                                tagsStyles={{
                                    p: {
                                        fontSize: 18,
                                    }
                                }}
                            />
                            <FlatList
                                Style={{ flex: 1, marginVertical: 5 }}
                                data={articlesByCategory}
                                keyExtractor={item => item.id.toString()}
                                onEndReachedThreshold={0.25}
                                onEndReached={this._loadMore}
                                onRefresh={this._handleRefresh}
                                refreshing={category.isFetching}

                            />
                        </View>
                }

            </ScrollView>
        );
    }
    // bug could be introduced here because wp API doesnt search custom fields -- name has to be in title or body
    _loadProfile = async (payload) => {
        const { navigation, activeDomain } = this.props;
        try {
            const userDomain = activeDomain.url;
            const writerName = navigation.getParam('writerName', 'unknown');
            if (writerName !== 'unknown') {
                const response = await fetch(`${userDomain}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=name&meta_query[0][value]=${writerName}`)
                const profile = await response.json();
                if (profile.length > 0) {
                    // if more than one matches uses first one
                    const profileId = profile[0].ID;
                    const newResponse = await fetch(`${userDomain}/wp-json/wp/v2/posts/${profileId}`)
                    const writerProfile = await newResponse.json();
                    console.log('respq', writerProfile)
                    // if featured image is avail then get it
                    if (writerProfile._links['wp:featuredmedia']) {
                        const response = await fetch(writerProfile._links['wp:featuredmedia'][0].href);
                        const profileImage = await response.json();
                        writerProfile.profileImage = profileImage.media_details.sizes.full.source_url;
                    }
                    // get list of articles written by writer
                    const articlesByWriter = await fetch(`${userDomain}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=writer&meta_query[0][value]=${writerName}`)
                    navigation.setParams({ profile: writerProfile })
                    console.log('loaded profile')
                }
                else {
                    navigation.setParams({ profile: 'none' })
                }
            }
        }
        catch (err) {
            console.log('error fetching profile page', err)
        }
    }

    _renderProfileImage = (profile) => {
        console.log('in render profile image')
        if (profile.profileImage) {
            return (
                <Image
                    style={styles.profileImage}
                    source={{ uri: profile.profileImage }}
                />
            )
        }
        else {
            return (
                <Image
                    style={styles.profileImage}
                    source={require('../assets/images/anon.png')}
                />
            )
        }
    }

    _viewLink = async (href) => {
        let result = await WebBrowser.openBrowserAsync(href);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profileInfoContainer: {
        alignItems: 'center',
        paddingTop: 25
    },
    profileImageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 25
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    },
    position: {
        fontSize: 21,
        textAlign: 'center',
        color: Colors.gray
    },
    textContainer: {
        paddingVertical: 20
    },
    schoolyear: {
        fontSize: 21,
        textAlign: 'center',
        color: Colors.tintColor,
        padding: 5
    }
});