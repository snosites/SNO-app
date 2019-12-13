export default errorReducer = (state = {}, action) => {
    const { type } = action
    const matches = /(.*)_(REQUEST|ERROR)/.exec(type)

    // not a *_REQUEST / *_ERROR actions, so we ignore them
    if (!matches) return state

    const [, requestName, requestState] = matches
    return {
        ...state,
        // Store errorMessage
        // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
        //      else clear errorMessage when receiving GET_TODOS_REQUEST
        [requestName]: requestState === 'ERROR' ? action.error : ''
    }
}

// selectors
export const createErrorMessageSelector = actions => state => {
    
    const errors = actions.map(action => state.errors[action])
    if (errors && errors[0]) {
        return errors[0]
    }
    return ''
}
