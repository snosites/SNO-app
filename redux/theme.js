import { defaultColorTheme, defaultNavigationTheme } from '../constants/Colors'
import Color from 'color'

export const types = {
    SAVE_THEME: 'SAVE_THEME',
}

export default function theme(state = defaultColorTheme, action) {
    switch (action.type) {
        case types.SAVE_THEME:
            let primaryColor = Color(action.theme.primary || defaultColorTheme.colors.primary)
            let primaryIsDark = primaryColor.isDark()
            let accentColor = Color(action.theme.accent || defaultColorTheme.colors.accent)
            let accentIsDark = accentColor.isDark()
            let homeCategoryColor = Color(
                action.theme.homeCategoryColor || defaultColorTheme.colors.homeScreenCategoryTitle
            )
            let homeCategoryColorIsDark = homeCategoryColor.isDark()

            let darkMode = false
            if (action.theme.darkMode.toLowerCase() == 'dark') {
                darkMode = true
            }
            const navigationTheme = {
                ...defaultNavigationTheme,
                colors: {
                    ...defaultNavigationTheme.colors,
                    primary: action.theme.accent || defaultColorTheme.colors.accent,
                },
            }
            return {
                ...defaultColorTheme,
                dark: darkMode,
                roundness: 2,
                colors: {
                    ...defaultColorTheme.colors,
                    primary: action.theme.primary || defaultColorTheme.colors.primary,
                    accent: action.theme.accent || defaultColorTheme.colors.accent,
                    homeScreenCategoryTitle: homeCategoryColor,
                },
                primaryIsDark,
                accentIsDark,
                homeScreenCategoryTitleIsDark: homeCategoryColorIsDark,
                navigationTheme,
            }
        default:
            return state
    }
}

export const actions = {
    saveTheme: (theme) => ({ type: types.SAVE_THEME, theme }),
}
