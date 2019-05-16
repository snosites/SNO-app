import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    Platform,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import Color from 'color';
import { connect } from 'react-redux';
import { WebBrowser, LinearGradient, Haptic } from 'expo';
import { Feather } from '@expo/vector-icons';

import HTML from 'react-native-render-html';
// import Colors from '../constants/Colors';
import { NavigationEvents } from 'react-navigation';

import { Divider, Colors } from 'react-native-paper';


class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile' //navigation.getParam('menuTitle', 'Stories'),

        };
    };

    state = {
        articlesByWriter: []
    }

    render() {
        const { navigation, theme } = this.props;
        const profile = navigation.getParam('profile', 'loading');
        const articlesByWriter = navigation.getParam('articlesByWriter', []);
        let primaryColor = Color(theme.colors.primary);
        let primaryIsDark = primaryColor.isDark();
        let accentColor = Color(theme.colors.accent);
        let accentIsDark = accentColor.isDark();
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <NavigationEvents
                    onWillFocus={payload => this._loadProfile(payload)}
                />
                {profile == 'loading' ?
                    <View style={{ flex: 1, paddingTop: 20, alignItems: 'center' }}>
                        <ActivityIndicator />
                    </View>
                    :
                    profile == 'none' ?
                        <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
                            <Image
                                style={styles.noProfileImage}
                                source={require('../assets/images/anon.png')}
                            />
                            <Text style={{ fontSize: 28, textAlign: 'center', paddingVertical: 20 }}>
                                This person does not appear to have a profile page
                            </Text>
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <View style={{ alignItems: 'center' }}>
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
                                            fontSize: 17,
                                        }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, paddingBottom: 20, backgroundColor: accentColor }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <LinearGradient
                                        colors={[theme.colors.primary, theme.colors.primary]}
                                        start={[0, 0.5]}
                                        end={[1, 0.5]}
                                        style={styles.listHeader}>
                                        <Text
                                            numberOfLines={2}
                                            ellipsizeMode='middle'
                                            style={{
                                                backgroundColor: 'transparent',
                                                fontSize: 19,
                                                color: primaryIsDark ? 'white' : 'black',
                                                textAlign: 'center',
                                            }}>
                                            {`Recent Articles Authored By ${profile.custom_fields.name[0]}`}
                                        </Text>
                                    </LinearGradient>
                                </View>
                                <FlatList
                                    contentContainerStyle={{ flex: 1, marginTop: 40 }}
                                    data={articlesByWriter}
                                    keyExtractor={item => item.id ? item.id.toString() : null}
                                    ItemSeparatorComponent={() => (<Divider />)}
                                    // onEndReachedThreshold={0.25}
                                    // onEndReached={this._loadMore}
                                    // onRefresh={this._handleRefresh}
                                    // refreshing={category.isFetching}

                                    renderItem={(props) => {
                                        const story = props.item;
                                        return (
                                            <TouchableOpacity
                                                style={styles.storyContainer}
                                                onPress={this._handleArticlePress(story)}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <HTML
                                                        html={story.title.rendered}
                                                        baseFontStyle={{ fontSize: 19 }}
                                                        customWrapper={(text) => {
                                                            return (
                                                                <Text
                                                                    ellipsizeMode='tail'
                                                                    numberOfLines={2}
                                                                >
                                                                    {text}
                                                                </Text>
                                                            )
                                                        }}
                                                        tagsStyles={{
                                                            rawtext: {
                                                                flex: 1,
                                                                fontSize: 19,
                                                                textAlign: 'left',
                                                                color: accentIsDark ? 'white' : 'black'
                                                            }
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            flex: 1,
                                                            fontSize: 12,
                                                            textAlign: 'left',
                                                            color: accentIsDark ? 'white' : 'black'
                                                        }}>
                                                        {String(Moment(story.date).format('MMM D YYYY'))}
                                                    </Text>
                                                </View>
                                                <Feather
                                                    style={{ marginLeft: 20 }}
                                                    name="chevron-right"
                                                    size={32}
                                                    color={accentIsDark ? 'white' : 'black'} />
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        </View>
                }
            </ScrollView>
        );
    }

    _loadProfile = async (payload) => {
        const { navigation, activeDomain } = this.props;
        try {
            const userDomain = activeDomain.url;
            const writerName = navigation.getParam('writerName', 'unknown');
            if (writerName !== 'unknown') {
                const response = await fetch(`https://${userDomain}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=name&meta_query[0][value]=${writerName}`)
                const profile = await response.json();
                console.log('wrter name', writerName, userDomain)
                if (profile.length > 0) {
                    // if more than one matches uses first one
                    const profileId = profile[0].ID;
                    const newResponse = await fetch(`https://${userDomain}/wp-json/wp/v2/posts/${profileId}`)
                    const writerProfile = await newResponse.json();

                    // if featured image is avail then get it
                    if (writerProfile._links['wp:featuredmedia']) {
                        const response = await fetch(writerProfile._links['wp:featuredmedia'][0].href);
                        const profileImage = await response.json();
                        writerProfile.profileImage = profileImage.source_url;
                    }
                    // get list of articles written by writer
                    const query = await fetch(`https://${userDomain}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=writer&meta_query[0][value]=${writerName}&per_page=20`)

                    const articlesByWriter = await query.json();
                    console.log('articles by writer', articlesByWriter)
                    // get the full posts for all articles
                    const updatedArticlesByWriter = await Promise.all(articlesByWriter.map(async article => {
                        const response = await fetch(`https://${userDomain}/wp-json/wp/v2/posts/${article.ID}`)
                        return await response.json();
                    }))
                    let verifiedArticlesByWriter = updatedArticlesByWriter.filter(article => {
                        return (!!article.id)
                    })
                    //set those articles as param
                    navigation.setParams({
                        profile: writerProfile,
                        articlesByWriter: updatedArticlesByWriter
                    })
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

    _getAttachmentsAync = async (article) => {
        console.log('article', article)
        const response = await fetch(article._links['wp:attachment'][0].href);
        const imageAttachments = await response.json();
        return imageAttachments;
    }

    _handleArticlePress = article => async () => {
        console.log('in article press')
        const { navigation } = this.props;
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
        // check if there is a slidehsow
        if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
            article.slideshow = await this._getAttachmentsAync(article);
        }
        navigation.push('FullArticle', {
            articleId: article.id,
            article,
        })
    }

    _viewLink = async (href) => {
        let result = await WebBrowser.openBrowserAsync(href);
    }

}

const styles = StyleSheet.create({
    profileImageContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 5
    },
    noProfileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: 1
    },
    position: {
        fontSize: 19,
        textAlign: 'center',
        color: Colors.grey400
    },
    textContainer: {
        paddingTop: 20,
        paddingBottom: 70,
        paddingHorizontal: 20
    },
    storyContainer: {
        // height: 70,
        // width: 300,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    listHeader: {
        padding: 15,
        paddingHorizontal: 25,
        justifyContent: 'center',
        height: 80,
        alignItems: 'center',
        borderRadius: 10,
        position: 'absolute',
        marginHorizontal: 30,
        top: -40
    }
});

const mapStateToProps = (state) => {
    return {
        activeDomain: state.activeDomain,
        theme: state.theme
    }
}

export default connect(mapStateToProps)(ProfileScreen);