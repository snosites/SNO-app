

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
    if (response.status == 200) {
        story.comments = comments
    } else {
        story.comments = []
    }
    return;
}

export async function asyncFetchFeaturedImage(url, story) {
    const imgResponse = await fetch(url);
    const featuredImage = await imgResponse.json();
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

export async function asyncFetchComments(url, story) {
    const response = await fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`);
    const comments = await response.json();
    if(response.status == 200) {
        story.comments = comments
    } else {
        story.comments = []
    }
    return;
}