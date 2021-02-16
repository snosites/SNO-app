import domainApiService from '../api/domain'

export async function getAttachmentsAsync(article) {
    const response = await fetch(article._links['wp:attachment'][0].href)
    const imageAttachments = await response.json()
    return imageAttachments
}

export async function asyncFetchFeaturedImage(url, story) {
    try {
        const imgResponse = await fetch(url)
        const featuredImage = await imgResponse.json()
        console.log('featuredImage', featuredImage)
        if (!featuredImage.meta_fields) {
            if (
                featuredImage.media_details &&
                featuredImage.media_details.size &&
                featuredImage.media_details.sizes.large &&
                featuredImage.media_details.sizes.large.source_url
            ) {
                story.featuredImage = {
                    uri: featuredImage.media_details.sizes.large.source_url,
                    width: featuredImage.media_details.sizes.large.width,
                    height: featuredImage.media_details.sizes.large.height,
                    photographer: '',
                    caption:
                        featuredImage.caption && featuredImage.caption.rendered
                            ? featuredImage.caption.rendered
                            : '',
                }
            } else {
                story.featuredImage = {
                    uri: featuredImage.source_url,
                    width: featuredImage.media_details.width,
                    height: featuredImage.media_details.height,
                    photographer: '',
                    caption:
                        featuredImage.caption && featuredImage.caption.rendered
                            ? featuredImage.caption.rendered
                            : '',
                }
            }
            return
        } else {
            let termId = null
            if (featuredImage.meta_fields.terms && featuredImage.meta_fields.terms[0]) {
                termId = featuredImage.meta_fields.terms[0].term_id
            }

            if (
                featuredImage.media_details &&
                featuredImage.media_details.size &&
                featuredImage.media_details.sizes.large &&
                featuredImage.media_details.sizes.large.source_url
            ) {
                story.featuredImage = {
                    uri: featuredImage.media_details.sizes.large.source_url,
                    width: featuredImage.media_details.sizes.large.width,
                    height: featuredImage.media_details.sizes.large.height,
                    photographer: featuredImage.meta_fields.photographer
                        ? featuredImage.meta_fields.photographer
                        : '',
                    caption:
                        featuredImage.caption && featuredImage.caption.rendered
                            ? featuredImage.caption.rendered
                            : '',
                    photographerTermId: termId,
                }
            } else {
                story.featuredImage = {
                    uri: featuredImage.media_details.sizes.full.source_url,
                    width: featuredImage.media_details.width,
                    height: featuredImage.media_details.height,
                    photographer: featuredImage.meta_fields.photographer
                        ? featuredImage.meta_fields.photographer
                        : '',
                    caption:
                        featuredImage.caption && featuredImage.caption.rendered
                            ? featuredImage.caption.rendered
                            : '',
                    photographerTermId: termId,
                }
            }
            return
        }
    } catch (err) {
        console.log('error trying to fetch article featured image', err)
        return
    }
}

export async function asyncFetchComments(url, story) {
    const response = await fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`)
    const comments = await response.json()
    if (response.status == 200) {
        story.comments = comments
    } else {
        story.comments = []
    }
    return
}

export async function asyncFetchArticle(domainUrl, articleId, isChapter = false) {
    try {
        const article = await domainApiService.fetchArticle(domainUrl, articleId)

        if (
            article._links &&
            article._links['wp:featuredmedia'] &&
            article._links['wp:featuredmedia'][0]
        ) {
            await asyncFetchFeaturedImage(`${article._links['wp:featuredmedia'][0].href}`, article)
        }
        if (
            article.custom_fields.featureimage &&
            article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images'
        ) {
            article.slideshow = await getAttachmentsAsync(article)
        }

        let storyChapters = []
        let metaKey = ''

        if (!isChapter) {
            if (article.custom_fields.sno_format == 'Long-Form') {
                metaKey = 'sno_longform_list'
            } else if (article.custom_fields.sno_format == 'Grid') {
                metaKey = 'sno_grid_list'
            } else if (article.custom_fields.sno_format == 'Side by Side') {
                metaKey = 'sno_sidebyside_list'
            }
            if (metaKey) {
                let results = await fetch(
                    `https://${domainUrl}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=${metaKey}&meta_query[0][value]=${article.id}`
                )
                storyChapters = await results.json()
            }
        }

        let updatedStoryChapters = await Promise.all(
            storyChapters.map(async (article) => {
                return await asyncFetchArticle(domainUrl, article.ID, true)
            })
        )

        article.storyChapters = updatedStoryChapters

        await asyncFetchComments(domainUrl, article)

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

        return article
    } catch (err) {
        console.log('error fetching article async', err)
        throw err
    }
}
