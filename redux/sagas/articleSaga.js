import { put, call, takeLatest } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestArticles, receiveArticles } from '../actions/actions';

const articleSchema = new schema.Entity('articles')
const articleListSchema = new schema.Array(articleSchema)


function* fetchArticles(action){
    const { domain, category } = action.payload;
    try {
        yield put(requestArticles(category))
        const response = yield fetch(`${domain}/wp-json/wp/v2/posts?categories=${category}`)
        const stories = yield response.json();
        const normalizedData = normalize(stories, articleListSchema);
        // console.log('normalized data', normalizedData)
        yield put(receiveArticles(category, normalizedData))
    }
    catch(err) {
        console.log('error fetching articles in saga')
    }
}

function* articleSaga() {
    yield takeLatest('FETCH_ARTICLES', fetchArticles);
}

export default articleSaga;