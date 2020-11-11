export const types = {
    SAVE_ARTICLE: 'SAVE_ARTICLE',
    REMOVE_SAVED_ARTICLE: 'REMOVE_SAVED_ARTICLE',
    INITIALIZE_SAVED: 'INITIALIZE_SAVED',
}

export default function savedArticlesBySchool(state = {}, action) {
    switch (action.type) {
        case types.SAVE_ARTICLE:
        case types.REMOVE_SAVED_ARTICLE:
        case types.INITIALIZE_SAVED:
            return {
                ...state,
                [action.school]: savedArticles(state[action.school], action),
            }
        default:
            return state
    }
}

function savedArticles(state = [], action) {
    switch (action.type) {
        case types.SAVE_ARTICLE:
            let found = state.find((article) => {
                return action.article.id == article.id
            })
            if (found) {
                return state
            }
            return [...state, action.article]
        case types.REMOVE_SAVED_ARTICLE:
            return state.filter((article) => {
                return article.id !== action.articleId
            })
        default:
            return state
    }
}

export const actions = {
    // SAVED ARTICLES
    saveArticle(article, schoolId) {
        return { type: types.SAVE_ARTICLE, article, school: schoolId }
    },
    removeSavedArticle(articleId, schoolId) {
        return { type: types.REMOVE_SAVED_ARTICLE, articleId, school: schoolId }
    },
    initializeSaved(schoolId) {
        return { type: types.INITIALIZE_SAVED, school: schoolId }
    },
}
