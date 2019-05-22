import {
    SAVE_ARTICLE,
    REMOVE_SAVED_ARTICLE,
    INITIALIZE_SAVED
} from '../actionCreators/articles'

export function savedArticlesBySchool(state = {}, action) {
    switch (action.type) {
        case SAVE_ARTICLE:
        case REMOVE_SAVED_ARTICLE:
        case INITIALIZE_SAVED:
            return {
                ...state,
                [action.school]: savedArticles(state[action.school], action)
            }
        default:
            return state
    }
}

function savedArticles(
    state = [],
    action
) {
    switch (action.type) {
        case SAVE_ARTICLE:
            let found = state.find(article => {
                return action.article.id == article.id
            })
            if (found) {
                return state
            }
            return [
                ...state,
                action.article
            ]
        case REMOVE_SAVED_ARTICLE:
            return state.filter(article => {
                return article.id !== action.articleId
            })
        default:
            return state
    }
}