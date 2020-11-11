export const types = {
    ADD_MESSAGE: 'ADD_MESSAGE',
    REMOVE_MESSAGE: 'REMOVE_MESSAGE',
}

export default function snackbarQueue(state = [], action) {
    switch (action.type) {
        case types.ADD_MESSAGE:
            return [...state, action.message]
        case types.REMOVE_MESSAGE:
            return state.slice(1)
        default:
            return state
    }
}

export const actions = {
    addMessage(message) {
        return { type: types.ADD_MESSAGE, message }
    },
    removeMessage() {
        return { type: types.REMOVE_MESSAGE }
    },
}
