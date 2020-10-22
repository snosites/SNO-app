import { defaultColorTheme } from '../constants/Colors'
import Color from 'color'

export const types = {
    SAVE_THEME: 'SAVE_THEME',
}

export default function theme(state = defaultColorTheme, action) {
    switch (action.type) {
        case types.SAVE_THEME:
            let primaryColor = Color(action.theme.primary)
            let primaryIsDark = primaryColor.isDark()
            let accentColor = Color(action.theme.accent)
            let accentIsDark = accentColor.isDark()

            let mode = true
            if (action.theme.theme.toLowerCase() == 'light') {
                mode = false
            }
            return {
                ...defaultColorTheme,
                dark: mode,
                roundness: 2,
                colors: {
                    ...defaultColorTheme.colors,
                    primary: action.theme.primary,
                    accent: action.theme.accent,
                },
                primaryIsDark,
                accentIsDark,
            }
        default:
            return state
    }
}

export const actions = {
    saveTheme: (theme) => ({ type: types.SAVE_THEME, theme }),
}
