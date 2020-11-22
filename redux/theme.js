import Color from 'color'

import { defaultColorTheme, defaultNavigationTheme, darkNavigationTheme } from '../constants/Colors'

const black = '#000000'
const white = '#ffffff'

export const types = {
    SAVE_THEME: 'SAVE_THEME',
    TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
}

export default function theme(state = defaultColorTheme, action) {
    switch (action.type) {
        case types.SAVE_THEME:
            let primaryColor = Color(action.theme.primary || state.colors.primary)
            let primaryIsDark = primaryColor.isDark()
            let primaryLightened = primaryColor.alpha(0.2).string()

            let accentColor = Color(action.theme.accent || state.colors.accent)
            let accentIsDark = accentColor.isDark()
            let accentLightened = Color(accentColor).alpha(0.7).string()
            let accentWhitened = Color(accentColor).whiten(0.7).alpha(0.2).string()

            let homeCategoryColor = Color(
                action.theme.homeCategoryColor || state.colors.homeScreenCategoryTitle
            )
            let homeCategoryColorIsDark = homeCategoryColor.isDark()

            const navigationTheme = {
                ...defaultNavigationTheme,
                colors: {
                    ...defaultNavigationTheme.colors,
                    primary: action.theme.accent || state.colors.accent,
                },
            }

            return {
                ...state,
                roundness: 2,
                colors: {
                    ...state.colors,
                    primary: action.theme.primary || state.colors.primary,
                    accent: action.theme.accent || state.colors.accent,
                    homeScreenCategoryTitle: homeCategoryColor,
                    primaryLightened,
                    accentLightened,
                    accentWhitened,
                },
                primaryIsDark,
                accentIsDark,
                homeScreenCategoryTitleIsDark: homeCategoryColorIsDark,
                navigationTheme,
            }
        case types.TOGGLE_DARK_MODE:
            const _darkNavigationTheme = {
                ...darkNavigationTheme,
                colors: {
                    ...darkNavigationTheme.colors,
                    primary: state.colors.accent,
                    notification: '#b51010',
                },
            }

            const _lightNavigationTheme = {
                ...defaultNavigationTheme,
                colors: {
                    ...defaultNavigationTheme.colors,
                    primary: state.colors.accent,
                    notification: '#b51010',
                },
            }

            if (action.darkMode) {
                return {
                    ...state,
                    dark: true,
                    mode: 'adaptive',
                    colors: {
                        ...state.colors,
                        background: _darkNavigationTheme.colors.background,
                        background: '#121212',
                        surface: '#121212',
                        error: '#CF6679',
                        onBackground: '#FFFFFF',
                        onSurface: '#FFFFFF',
                        text: white,
                        disabled: Color(white).alpha(0.38).rgb().string(),
                        placeholder: Color(white).alpha(0.54).rgb().string(),
                        backdrop: Color(black).alpha(0.5).rgb().string(),
                        notification: '#b51010',
                    },
                    navigationTheme: _darkNavigationTheme,
                }
            } else {
                return {
                    ...state,
                    dark: false,
                    mode: 'adaptive',
                    colors: {
                        ...state.colors,
                        background: _lightNavigationTheme.colors.background,
                        surface: white,
                        error: '#B00020',
                        text: black,
                        onBackground: '#000000',
                        onSurface: '#000000',
                        disabled: Color(black).alpha(0.26).rgb().string(),
                        placeholder: Color(black).alpha(0.54).rgb().string(),
                        backdrop: Color(black).alpha(0.5).rgb().string(),
                        notification: '#b51010',
                    },
                    navigationTheme: _lightNavigationTheme,
                }
            }
        default:
            return state
    }
}

export const actions = {
    saveTheme: (theme) => ({ type: types.SAVE_THEME, theme }),
    toggleDarkMode: (darkMode) => ({ type: types.TOGGLE_DARK_MODE, darkMode }),
}
