import { DefaultTheme } from 'react-native-paper'

export const types = {
           SAVE_THEME: 'SAVE_THEME'
       }


export default function theme(state = DefaultTheme, action) {
    switch (action.type) {
        case types.SAVE_THEME:
            let mode = true
            if (action.theme.theme.toLowerCase() == 'light') {
                mode = false
            }
            return {
                ...DefaultTheme,
                dark: mode,
                roundness: 2,
                colors: {
                    ...DefaultTheme.colors,
                    primary: action.theme.primary,
                    accent: action.theme.accent
                }
            }
        default:
            return state
    }
}

export const actions = {
    saveTheme: theme => ({ type: types.SAVE_THEME, theme })
}
