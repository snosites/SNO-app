import { put, call, takeLatest } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)


function* fetchArticles(action){
    console.log('in fetch articles saga')
    const { domain, category } = action.payload;
    try {
        const response = yield fetch(`${domain}/wp-json/wp/v2/posts?categories=${category}`)
        const stories = yield response.json();
        const normalizedData = normalize(stories, articleListSchema);
        console.log('normalized data', normalizedData)
        put()
    }
    catch(err) {
        console.log('error fetching articles in saga')
    }
}

function* articleSaga() {
    yield takeLatest('FETCH_ARTICLES', fetchArticles);
}

export default articleSaga;