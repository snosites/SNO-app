import domainApiService from '../api/domain'

export async function asyncFetchFeaturedImage(url, story) {
    try {
        const imgResponse = await fetch(url)
        const featuredImage = await imgResponse.json()
        if (!featuredImage.meta_fields) {
            story.featuredImage = {
                uri: featuredImage.source_url,
                photographer: '',
                caption:
                    featuredImage.caption && featuredImage.caption.rendered
                        ? featuredImage.caption.rendered
                        : ''
            }
            return
        }
        story.featuredImage = {
            uri: featuredImage.source_url,
            photographer: featuredImage.meta_fields.photographer
                ? featuredImage.meta_fields.photographer
                : '',
            caption:
                featuredImage.caption && featuredImage.caption.rendered
                    ? featuredImage.caption.rendered
                    : ''
        }
        return
    } catch(err){
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

export async function asyncFetchArticle(domainUrl, articleId) {
    try {
        const article = await domainApiService.fetchArticle(domainUrl, articleId)

        if (
            article._links &&
            article._links['wp:featuredmedia'] &&
            article._links['wp:featuredmedia'][0]
        ) {
            await asyncFetchFeaturedImage(`${article._links['wp:featuredmedia'][0].href}`, article)
        }
        await asyncFetchComments(domainUrl, article)

        return article
    } catch (err) {
        console.log('error fetching article async', err)
        throw err
    }
}
