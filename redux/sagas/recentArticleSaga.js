import { all, put, call, takeLatest, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestRecentArticles, receiveRecentArticles } from '../actions/actions';

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

function* fetchComments(url, story) {
    const response = yield fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`);
    const comments = yield response.json();
    story.comments = comments
    return;
}

function* fetchRecentArticles(action) {
    const { domain, categories, page } = action;
    try {
        const query = `https://${domain}/wp-json/wp/v2/posts?categories=${categories.join(',')}&page=${page}`
        yield put(requestRecentArticles())
        const response = yield fetch(query)
        const stories = yield response.json();
        yield all(stories.map(story => {
            if (story._links['wp:featuredmedia']) {
                return call(fetchFeaturedImage, `${story._links['wp:featuredmedia'][0].href}`, story)
            } else {
                return call(Promise.resolve)
            }
        }))
        yield all(stories.map(story => {
            return call(fetchComments, domain, story)
        }))
        const normalizedData = normalize(stories, articleListSchema);
        yield put(receiveRecentArticles(normalizedData))
    }
    catch (err) {
        console.log('error fetching recent articles in saga', err)
    }
}

function shouldFetchRecentArticles(articles) {
    // if category doesnt exist fetch
    if (articles.items.length === 0) {
        return true
    }
    // if already fetching dont fetch
    else if (articles.isFetching) {
        return false
    }
    // if didInvalidate is true then fetch
    else {
        return articles.didInvalidate
    }
}

function shouldFetchMoreRecentArticles(articles) {
    // if page is not at max fetch more
    if (articles.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getMenuState = state => state.menus
const getRecentArticleState = state => state.recentArticles


function* fetchRecentArticlesIfNeeded(action) {
    const { domain } = action;
    const recentArticles = yield select(getRecentArticleState);
    if (shouldFetchRecentArticles(recentArticles)) {
        const menus = yield select(getMenuState);
        if (menus) {
            const filteredMenus = menus.items.filter(item => {
                return item.object === 'category'
            })
            const menuCategories = filteredMenus.map(item => {
                return Number(item.object_id)
            })
            console.log('menu categories', menuCategories)
            yield call(fetchRecentArticles, {
                domain,
                categories: menuCategories,
                page: 1
            })
        }
    }
}



function* fetchMoreRecentArticlesIfNeeded(action) {
    const { domain } = action;
    const recentArticles = yield select(getRecentArticleState);
    if (shouldFetchMoreRecentArticles(recentArticles)) {
        const menus = yield select(getMenuState);
        if (menus) {
            const filteredMenus = menus.items.filter(item => {
                return item.object === 'category'
            })
            const menuCategories = filteredMenus.map(item => {
                return Number(item.object_id)
            })
            yield call(fetchRecentArticles, {
                domain,
                categories: menuCategories,
                page: recentArticles.page
            })
        }
    }
}

function* recentArticleSaga() {
    yield takeLatest('FETCH_RECENT_ARTICLES_IF_NEEDED', fetchRecentArticlesIfNeeded);
    yield takeLatest('FETCH_MORE_RECENT_ARTICLES_IF_NEEDED', fetchMoreRecentArticlesIfNeeded);

}

export default recentArticleSaga;