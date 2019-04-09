import { all, put, call, takeLatest } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestArticles, receiveArticles } from '../actions/actions';

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)


function* fetchFeaturedImage(url, story) {
    const imgResponse = yield fetch(url);
    const featuredImage = yield imgResponse.json();
    story.featuredImage = {
        uri: featuredImage.media_details.sizes.full.source_url,
        photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : 'Unknown',
        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
    }
}


function* fetchArticles(action) {
    const { domain, category, page } = action.payload;
    try {
        yield put(requestArticles(category))
        const response = yield fetch(`${domain}/wp-json/wp/v2/posts?categories=${category}&page=${page}`)
        const stories = yield response.json();
        yield all(stories.map(story => {
            return call(fetchFeaturedImage, `${story._links['wp:featuredmedia'][0].href}`, story)
        }))
        const normalizedData = normalize(stories, articleListSchema);
        yield put(receiveArticles(category, normalizedData))
    }
    catch (err) {
        console.log('error fetching articles in saga', err)
    }
}

// _getFeaturedImage = async (story) => {
//     try {
//         if (story._links['wp:featuredmedia']) {
//             const imgResponse = await fetch(`${story._links['wp:featuredmedia'][0].href}`)
//             const featuredImage = await imgResponse.json();
//             console.log('featured image', featuredImage)
//             story.featuredImage = {
//                 uri: featuredImage.media_details.sizes.full.source_url,
//                 photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : 'Unknown',
//                 caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
//             }
//             return (
//                 <Image
//                     source={{ uri: 'http://travislang.snodemo.com/wp-content/uploads/2019/03/DWYSr7tz_400x400.jpg' }}
//                     style={styles.featuredImage}
//                 />
//             )

//         }
//         else {
//             return null
//         }

//     }
//     catch (err) {
//         console.log('error getting featured image')
//     }
// }

function* articleSaga() {
    yield takeLatest('FETCH_ARTICLES', fetchArticles);
}

export default articleSaga;