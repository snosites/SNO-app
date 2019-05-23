

export function* fetchFeaturedImage(url, story) {
    const imgResponse = yield fetch(url);
    const featuredImage = yield imgResponse.json();
    if (!featuredImage.meta_fields) {
        story.featuredImage = {
            uri: featuredImage.source_url,
            photographer: 'Unknown',
            caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
        }
        return;
    }
    story.featuredImage = {
        uri: featuredImage.source_url,
        photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : 'Unknown',
        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
    }
}

export function* fetchComments(url, story) {
    const response = yield fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`);
    const comments = yield response.json();
    story.comments = comments
    return;
}