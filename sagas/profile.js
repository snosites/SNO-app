import uniqBy from 'lodash/uniqBy'
import { put, call, takeLatest, all, select } from 'redux-saga/effects'

import { types as profileTypes, actions as profileActions } from '../redux/profiles'
import { getActiveDomain } from '../redux/domains'

import { asyncFetchFeaturedImage, asyncFetchComments } from '../utils/sagaHelpers'

import * as Sentry from 'sentry-expo'
import domainApiService from '../api/domain'

function* fetchProfiles(action) {
    const { domain, year } = action
    try {
        yield put(profileActions.requestProfiles())
        const profiles = yield call(domainApiService.fetchProfiles, domain, year)
        yield put(profileActions.receiveProfiles(profiles))
    } catch (err) {
        console.log('error fetching profiles in saga', err)
        Sentry.captureException(err)
    }
}

function* fetchProfile(action) {
    const { profileId } = action
    try {
        const domain = yield select(getActiveDomain)

        yield put(profileActions.fetchProfileRequest())

        const profile = yield call(domainApiService.fetchProfile, domain.url, profileId)
        yield put(profileActions.fetchProfileSuccess(profile))
    } catch (err) {
        console.log('error fetching profile in saga', err)
        yield put(profileActions.fetchProfileError('error fetching profile'))
        Sentry.captureException(err)
    }
}

function* fetchAuthorArticle(url, articleId) {
    try {
        const response = yield call(domainApiService.fetchArticle, url, articleId)
        return response
    } catch (err) {
        throw new Error('error fetching posts by author')
    }
}

function* fetchProfileArticles(action) {
    try {
        const { url, writerTermId } = action

        // get list of articles written by writer
        const authorArticles = yield call(domainApiService.fetchProfileArticles, url, writerTermId)

        if (authorArticles.length == 0) {
            throw new Error('no posts')
        }
        // filter out duplicates
        const articlesByWriter = uniqBy(authorArticles, 'ID')

        // get the full posts for all articles
        const updatedArticlesByWriter = yield all(
            articlesByWriter.map((article) => {
                return call(fetchAuthorArticle, url, article.ID)
            })
        )
        // filter out any bad requests
        const verifiedArticlesByWriter = updatedArticlesByWriter.filter((article) => {
            return !!article.id
        })
        // get featured images
        yield all(
            verifiedArticlesByWriter.map((story) => {
                if (story._links['wp:featuredmedia']) {
                    return call(
                        asyncFetchFeaturedImage,
                        `${story._links['wp:featuredmedia'][0].href}`,
                        story
                    )
                } else {
                    return call(Promise.resolve)
                }
            })
        )
        yield all(
            verifiedArticlesByWriter.map((story) => {
                return call(asyncFetchComments, url, story)
            })
        )
        yield put(profileActions.setProfileArticles(verifiedArticlesByWriter))
    } catch (err) {
        if (err.message === 'no posts') {
            yield put(profileActions.setProfileArticleError('no posts'))
            return
        } else if (err.message === 'error fetching posts by author') {
            yield put(profileActions.setProfileArticleError('error fetching posts by author'))
            return
        }
        console.log('error in fetch profile articles saga', err.message)
        yield put(profileActions.setProfileArticleError('error fetching posts by author'))
        Sentry.captureException(err)
    }
}

function* profilesSaga() {
    yield all([
        takeLatest(profileTypes.FETCH_PROFILES, fetchProfiles),
        takeLatest(profileTypes.FETCH_PROFILE, fetchProfile),
        takeLatest(profileTypes.FETCH_PROFILE_ARTICLES, fetchProfileArticles),
    ])
}

export default profilesSaga
