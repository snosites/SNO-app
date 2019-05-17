import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import Moment from 'moment';
import Color from 'color';
import HTML from 'react-native-render-html';
import { Haptic } from 'expo';

import { handleArticlePress } from '../utils/articlePress';

import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';


export default class ArticleListContent extends React.Component {

    render() {
        const { 
            articleList, 
            isRefreshing, 
            isFetching, 
            saveRef, 
            loadMore, 
            handleRefresh
        } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={articleList}
                    keyExtractor={item => item.id.toString()}
                    ref={(ref) => { 
                        if(saveRef){
                            saveRef(ref) 
                        }
                        return;
                    }}
                    onEndReachedThreshold={0.25}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentum && loadMore) {
                            loadMore();
                            this.onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    onRefresh={handleRefresh ? handleRefresh : null}
                    refreshing={isRefreshing}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    ListFooterComponent={() => {
                        if (!isFetching) {
                            return null
                        }
                        return (
                            <View style={styles.loadingMore}>
                                <ActivityIndicator />
                            </View>
                        )
                    }}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    _renderItem = ({ item }) => {
        const { theme, onIconPress, deleteIcon, activeDomain } = this.props;
        const article = item;
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleArticlePress(article, activeDomain)}
            >
                <View style={styles.storyContainer}>
                    {article.featuredImage ?
                        <Image
                            source={{ uri: article.featuredImage.uri }}
                            style={styles.featuredImage}
                        />
                        :
                        null
                    }
                    <View style={styles.storyInfo}>
                        <HTML
                            html={article.title.rendered}
                            baseFontStyle={{ fontSize: 17 }}
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
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: theme.dark ? 'white' : 'black'
                                }
                            }}
                        />
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{
                                color: theme.colors.accent,
                                fontSize: 15
                            }}
                        >
                            {article.custom_fields.writer ? this._renderWriters(article.custom_fields.writer) : ''}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                {this._renderDate(article.date)}
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            justifySelf: 'end',
                            justifyContent: 'space-between'
                        }}
                    >
                        <View>
                            <FontAwesome
                                name="comment"
                                size={21}
                                color='#e0e0e0'
                            />
                            <Badge
                                size={16}
                                style={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 4,
                                    backgroundColor: theme.colors.accent,
                                }}
                            >
                                {article.comments.length > 99 ? '99' : article.comments.length}
                            </Badge>
                        </View>
                        <MaterialIcons
                            name={
                                deleteIcon ? 'delete' :
                                (article.saved ? 'bookmark'
                                    :
                                    'bookmark-border')
                            }
                            color={deleteIcon ? '#c62828' : theme.colors.accent}
                            style={{ paddingHorizontal: 5 }}
                            size={24}
                            onPress={() => {onIconPress(article)}}
                        />
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    // _getAttachmentsAync = async (article) => {
    //     console.log('article', article)
    //     const response = await fetch(article._links['wp:attachment'][0].href);
    //     const imageAttachments = await response.json();
    //     return imageAttachments;
    // }

    // _handleArticlePress = article => () => {
    //     if (Platform.OS === 'ios') {
    //         Haptic.selection();
    //     }
    //     console.log('article', article)
    //     if (article.custom_fields.sno_format && article.custom_fields.sno_format == 'Classic') {
    //         this._handleRegularArticle(article)
    //     } else {
    //         this._handleLongFormArticle(article);
    //     }
    // }

    // _handleRegularArticle = async (article) => {
    //     console.log('in article press')
    //     const { navigation } = this.props;
    //     if (Platform.OS === 'ios') {
    //         Haptic.selection();
    //     }
    //     // check if there is a slidehsow
    //     if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
    //         article.slideshow = await this._getAttachmentsAync(article);
    //     }
    //     navigation.navigate('FullArticle', {
    //         articleId: article.id,
    //         article,
    //         commentNumber: article.comments.length,
    //         comments: article.comments
    //     })
    // }

    // _handleLongFormArticle = async article => {
    //     console.log('in article press long form')
    //     const { navigation, activeDomain } = this.props;
    //     let storyChapters = [];
    //     navigation.navigate('FullArticle');
    //     if (article.custom_fields.sno_format == "Long-Form") {
    //         let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_longform_list&meta_query[0][value]=${article.id}`)
    //         storyChapters = await results.json();
    //     }
    //     else if (article.custom_fields.sno_format == "Grid") {
    //         let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_grid_list&meta_query[0][value]=${article.id}`)
    //         storyChapters = await results.json();
    //     }
    //     else if (article.custom_fields.sno_format == "Side by Side") {
    //         let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_sidebyside_list&meta_query[0][value]=${article.id}`)
    //         storyChapters = await results.json();
    //     }
    //     let updatedStoryChapters = await Promise.all(storyChapters.map(async article => {
    //         const response = await fetch(`https://${activeDomain.url}/wp-json/wp/v2/posts/${article.ID}`)
    //         return await response.json();
    //     }))
    //     updatedStoryChapters = await Promise.all(updatedStoryChapters.map(async article => {
    //         if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
    //             article.slideshow = await this._getAttachmentsAync(article);
    //         }
    //         if (article._links['wp:featuredmedia']) {
    //             const imgResponse = await fetch(article._links['wp:featuredmedia'][0].href);
    //             const featuredImage = await imgResponse.json();
    //             if (!featuredImage.meta_fields) {
    //                 article.featuredImage = {
    //                     uri: featuredImage.source_url,
    //                     photographer: 'Unknown',
    //                     caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
    //                 }
    //                 return article
    //             }
    //             article.featuredImage = {
    //                 uri: featuredImage.source_url,
    //                 photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
    //                 caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
    //             }
    //         }
    //         return article
    //     }))
    //     if (article.custom_fields.sno_format == "Long-Form") {
    //         console.log('updated chapters', updatedStoryChapters)
    //         // sort long form chapters
    //         updatedStoryChapters.sort(function (a, b) {
    //             if (a.custom_fields.sno_longform_order && a.custom_fields.sno_longform_order[0] < b.custom_fields.sno_longform_order && b.custom_fields.sno_longform_order[0])
    //                 return -1;
    //             if (a.custom_fields.sno_longform_order && a.custom_fields.sno_longform_order[0] > b.custom_fields.sno_longform_order && b.custom_fields.sno_longform_order[0])
    //                 return 1;
    //             return 0;
    //         })
    //     }
    //     navigation.navigate('FullArticle', {
    //         articleId: article.id,
    //         article,
    //         articleChapters: updatedStoryChapters,
    //         commentNumber: article.comments.length,
    //         comments: article.comments
    //     })
    // }

    _renderDate = date => {
        return (
            <Text style={{
                fontSize: 15,
                color: '#9e9e9e'
            }}
            >
                {Moment().isAfter(Moment(date).add(7, 'days')) 
                ?
                    String(Moment(date).format('MMM D YYYY'))
                :
                    String(Moment(date).fromNow())
                }
            </Text>
        )
    }

    _renderWriters = writers => {
        let newArr = '';
        for(let i = 0; i < writers.length; i++) {
            console.log('new arr', newArr)
            if(i === writers.length - 2){
                newArr += `${writers[i]} & `
            } 
            else if(i === writers.length - 1) {
                newArr += `${writers[i]}`
            } else {
                newArr += `${writers[i]}, `
            }
        }
        
        return newArr;
    }

}

const styles = StyleSheet.create({
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    },
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    },

})