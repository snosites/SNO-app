import { all, put, call, takeLatest, select } from 'redux-saga/effects';
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
    const { domain, category, page } = action;
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

function shouldFetchArticles(articles) {
    // if category doesnt exist fetch
    if(!articles){
        return true
    }
    // if already fetching dont fetch
    else if(articles.isFetching){
        return false
    } 
    // if didInvalidate is true then fetch
    else {
        return articles.didInvalidate
    }
}

function shouldFetchMoreArticles(articles) {
    // if page is not at max fetch more
    if(articles.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getArticlesByCategory = state => state.articlesByCategory

function* fetchArticlesIfNeeded(action) {
    const { domain, category } = action.payload;
    const articlesByCategory = yield select(getArticlesByCategory);
    const articles = articlesByCategory[category];
    if(shouldFetchArticles(articles)) {
        yield call(fetchArticles, {
            domain,
            category,
            page: 1
        })
    }
}

function* fetchMoreArticlesIfNeeded(action) {
    const { domain, category } = action.payload;
    const articlesByCategory = yield select(getArticlesByCategory);
    const articles = articlesByCategory[category];
    if(shouldFetchMoreArticles(articles)) {
        yield call(fetchArticles, {
            domain,
            category,
            page: articles.page
        })
    }
}

function* articleSaga() {
    yield takeLatest('FETCH_ARTICLES_IF_NEEDED', fetchArticlesIfNeeded);
    yield takeLatest('FETCH_MORE_ARTICLES_IF_NEEDED', fetchMoreArticlesIfNeeded);

}

export default articleSaga;