import { put, call, takeLatest, all } from 'redux-saga/effects';
import { requestProfiles, receiveProfiles, setProfileArticles, setProfileArticleError } from '../actionCreators';

import Sentry from 'sentry-expo';

function* fetchProfiles(action){
    const { domain, year } = action;
    try {
        yield put(requestProfiles())
        const response = yield fetch(`https://${domain}/wp-json/sns-v2/get_profiles?year=${year}`)
        const profiles = yield response.json();
        yield put(receiveProfiles(profiles))
        
    }
    catch(err) {
        console.log('error fetching profiles in saga', err)
        Sentry.captureException(err)
    }
}

function* fetchFeaturedImage(url, story) {
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
        photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
    }
}

function* fetchComments(url, story) {
    try {
        const response = yield fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`);
        const comments = yield response.json();
        story.comments = comments
        return;
    }
    catch (err) {
        console.log('error fetching comments');
        story.comments = [];
        Sentry.captureException(err)
    }
}

function* fetchAuthorArticle(url, articleId){
    const response = yield call(fetch, `https://${url}/wp-json/wp/v2/posts/${articleId}`)
    return yield response.json();
}

function* fetchProfileArticles(action) {
    try{
        const { url, writerName } = action;
        // get list of articles written by writer
        const query = yield call(fetch, `https://${url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=writer&meta_query[0][value]=${writerName}&per_page=50`);
        if(query.status != 200){
            throw new Error('error fetching posts by author')
        }
        const articlesByWriter = yield query.json();
        // get the full posts for all articles
        const updatedArticlesByWriter = yield all(articlesByWriter.map(article => {
            return call(fetchAuthorArticle, url, article.ID)
        }))
        // filter out any bad requests
        const verifiedArticlesByWriter = updatedArticlesByWriter.filter(article => {
            return (!!article.id)
        })
        // get featured images
        yield all(verifiedArticlesByWriter.map(story => {
            if (story._links['wp:featuredmedia']) {
                return call(fetchFeaturedImage, `${story._links['wp:featuredmedia'][0].href}`, story)
            } else {
                return call(Promise.resolve);
            }
        }))
        yield all(verifiedArticlesByWriter.map(story => {
            return call(fetchComments, url, story)
        }))
        yield put(setProfileArticles(verifiedArticlesByWriter))

    } catch(err) {
        console.log('error in fetch profile articles saga', err)
        if (err === 'error fetching posts by author'){
            yield put(setProfileArticleError('error fetching posts by author'))
        }
        Sentry.captureException(err)
    }
    
}

function* profilesSaga() {
    yield takeLatest('FETCH_PROFILES', fetchProfiles);
    yield takeLatest('FETCH_PROFILE_ARTICLES', fetchProfileArticles);

}

export default profilesSaga;