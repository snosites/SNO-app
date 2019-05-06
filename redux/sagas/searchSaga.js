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
    const response = yield fetch(`${url}/wp-json/wp/v2/comments?post=${story.id}`);
    const comments = yield response.json();
    story.comments = comments
    return;
}

function* fetchSearchArticles(action) {
    const { domain, page, searchTerm } = action;
    try {
        const query = `${domain}/wp-json/wp/v2/posts?search=${searchTerm}&page=${page}`
        yield put(requestSearchArticles())
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
        yield put(receiveSearchArticles(normalizedData))
    }
    catch (err) {
        console.log('error fetching recent articles in saga', err)
    }
}

function shouldFetchSearchArticles(articles) {
    // if already fetching dont fetch
    if (articles.isFetching) {
        return false
    }
    // if didInvalidate is true then fetch
    else {
        return articles.didInvalidate
    }
}

function shouldFetchMoreSearchArticles(articles) {
    // if page is not at max fetch more
    if (articles.page !== 'max') {
        return true
    } else {
        return false
    }
}

const getSearchArticleState = state => state.SearchArticles

function* fetchRecentArticlesIfNeeded(action) {
    const { domain, searchTerm } = action;
    const searchArticles = yield select(getSearchArticleState);
    if (shouldFetchSearchArticles(searchArticles)) {
        yield call(fetchSearchArticles, {
            domain,
            searchTerm,
            page: 1
        })
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