import { Platform } from 'react-native'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Haptics from 'expo-haptics'
// import NavigationService from './NavigationService-old'
import { navigate, push } from './RootNavigation'
import { actions as globalActions } from '../redux/global'
import { store } from '../redux/configureStore'

getAttachmentsAsync = async (article) => {
    const response = await fetch(article._links['wp:attachment'][0].href)
    const imageAttachments = await response.json()
    return imageAttachments
}

export const handleArticlePress = (article, activeDomain, scrollToTop = false) => {
    // log the article to analytics
    Amplitude.logEventWithProperties('view story', {
        storyId: article.id,
    })

    store.dispatch(globalActions.addStoryView(activeDomain.url, article.id))

    console.log('article press', article)
    if (
        article.custom_fields.sno_format &&
        (article.custom_fields.sno_format == 'Classic' ||
            article.custom_fields.sno_format == 'Full-Width' ||
            article.custom_fields.sno_format == 'Side-Rails')
    ) {
        console.log('scroll to top', scrollToTop)
        handleRegularArticle(article, scrollToTop)
    } else {
        console.log('long form')
        // handleLongFormArticle(article, activeDomain, scrollToTop)
    }
}

handleRegularArticle = async (article, scrollToTop) => {
    Haptics.selectionAsync()
    // NavigationService.navigate('FullArticle', { scrollToTop })
    navigate('ArticleNavigator', { screen: 'Article', params: {}, comments: article.comments })
    // check if there is a slideshow
    if (
        article.custom_fields.featureimage &&
        article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images'
    ) {
        article.slideshow = await getAttachmentsAsync(article)
    }
    navigate('ArticleNavigator', {
        screen: 'Article',
        params: { article },
        comments: article.comments,
    })
    // NavigationService.navigate('FullArticle', {
    //     articleId: article.id,
    //     article,
    //     commentNumber: article.comments.length,
    //     comments: article.comments,
    //     scrollToTop,
    // })
}

handleLongFormArticle = async (article, activeDomain, scrollToTop) => {
    console.log('long form article press', article)
    Haptics.selectionAsync()
    let storyChapters = []
    NavigationService.navigate('FullArticle', { scrollToTop })
    if (article.custom_fields.sno_format == 'Long-Form') {
        let results = await fetch(
            `https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_longform_list&meta_query[0][value]=${article.id}`
        )
        storyChapters = await results.json()
        console.log('story chapters', storyChapters)
    } else if (article.custom_fields.sno_format == 'Grid') {
        let results = await fetch(
            `https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_grid_list&meta_query[0][value]=${article.id}`
        )
        storyChapters = await results.json()
    } else if (article.custom_fields.sno_format == 'Side by Side') {
        let results = await fetch(
            `https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_sidebyside_list&meta_query[0][value]=${article.id}`
        )
        storyChapters = await results.json()
    }
    let updatedStoryChapters = await Promise.all(
        storyChapters.map(async (article) => {
            const response = await fetch(
                `https://${activeDomain.url}/wp-json/wp/v2/posts/${article.ID}`
            )
            return await response.json()
        })
    )
    updatedStoryChapters = await Promise.all(
        updatedStoryChapters.map(async (article) => {
            if (
                article.custom_fields.featureimage &&
                article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images'
            ) {
                article.slideshow = await getAttachmentsAsync(article)
            }
            if (article._links['wp:featuredmedia']) {
                const imgResponse = await fetch(article._links['wp:featuredmedia'][0].href)
                const featuredImage = await imgResponse.json()
                if (!featuredImage.meta_fields) {
                    article.featuredImage = {
                        uri: featuredImage.source_url,
                        photographer: 'Unknown',
                        caption:
                            featuredImage.caption && featuredImage.caption.rendered
                                ? featuredImage.caption.rendered
                                : 'Unknown',
                    }
                    return article
                }
                article.featuredImage = {
                    uri: featuredImage.source_url,
                    photographer: featuredImage.meta_fields.photographer
                        ? featuredImage.meta_fields.photographer
                        : '',
                    caption:
                        featuredImage.caption && featuredImage.caption.rendered
                            ? featuredImage.caption.rendered
                            : '',
                }
            }
            return article
        })
    )
    if (article.custom_fields.sno_format == 'Long-Form') {
        // sort long form chapters
        updatedStoryChapters.sort(function (a, b) {
            if (
                a.custom_fields.sno_longform_order &&
                a.custom_fields.sno_longform_order[0] < b.custom_fields.sno_longform_order &&
                b.custom_fields.sno_longform_order[0]
            )
                return -1
            if (
                a.custom_fields.sno_longform_order &&
                a.custom_fields.sno_longform_order[0] > b.custom_fields.sno_longform_order &&
                b.custom_fields.sno_longform_order[0]
            )
                return 1
            return 0
        })
    }
    NavigationService.navigate('FullArticle', {
        articleId: article.id,
        article,
        articleChapters: updatedStoryChapters,
        commentNumber: article.comments.length,
        comments: article.comments,
        scrollToTop,
    })
}
