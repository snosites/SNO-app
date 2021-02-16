export const types = {
    LIKE_ARTICLE: 'LIKE_ARTICLE',
    REMOVE_LIKED_ARTICLE: 'REMOVE_LIKED_ARTICLE',
    INITIALIZE_LIKED: 'INITIALIZE_LIKED',
}

export default function likedArticlesBySchool(state = {}, action) {
    switch (action.type) {
        case types.LIKE_ARTICLE:
        case types.REMOVE_LIKED_ARTICLE:
        case types.INITIALIZE_LIKED:
            return {
                ...state,
                [action.school]: likedArticles(state[action.school], action),
            }
        default:
            return state
    }
}

function likedArticles(state = [], action) {
    switch (action.type) {
        case types.LIKE_ARTICLE:
            if (state.includes(action.articleId)) {
                return state
            }
            return [...state, action.articleId]
        case types.REMOVE_LIKED_ARTICLE:
            return state.filter((articleId) => {
                return articleId !== action.articleId
            })
        default:
            return state
    }
}

export const actions = {
    likeArticle(articleId, schoolId) {
        return { type: types.LIKE_ARTICLE, articleId, school: schoolId }
    },
    removeLikedArticle(articleId, schoolId) {
        return { type: types.REMOVE_LIKED_ARTICLE, articleId, school: schoolId }
    },
    initializeLiked(schoolId) {
        return { type: types.INITIALIZE_LIKED, school: schoolId }
    },
}
