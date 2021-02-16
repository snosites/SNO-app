import Color from 'color'

import { defaultColorTheme, defaultNavigationTheme, darkNavigationTheme } from '../constants/Colors'

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

const black = '#000000'
const white = '#ffffff'

// low limit
const CONTRAST_LIMIT = 5

const improveContrastRatio = (backgroundColor, mainColor) => {
    const contrastRatio = backgroundColor.contrast(mainColor)

    if (contrastRatio < CONTRAST_LIMIT) {
        const alteredColor = mainColor.mix(backgroundColor.negate(), 0.2)
        return improveContrastRatio(backgroundColor, alteredColor)
    }

    return mainColor
}

export const types = {
    SAVE_THEME: 'SAVE_THEME',
    TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
}

const themePersistConfig = {
    key: 'theme',
    version: 7,
    storage,
    whitelist: ['dark'],
    debug: true,
    timeout: 10000,
    stateReconciler: autoMergeLevel1,
}

function theme(state = defaultColorTheme, action) {
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
                    homeScreenCategoryTitle:
                        action.theme.homeCategoryColor || state.colors.homeScreenCategoryTitle,
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
            let _primaryColor = Color(state.oldPrimary || state.colors.primary)
            let _accentColor = Color(state.oldAccent || state.colors.accent)
            let _homeTitleColor = Color(
                state.oldHomeTitleColor || state.colors.homeScreenCategoryTitle
            )

            let _backgroundColor = Color(
                action.darkMode ? '#121212' : defaultNavigationTheme.colors.background
            )

            const alteredPrimaryColor = improveContrastRatio(_backgroundColor, _primaryColor)
            const alteredAccentColor = improveContrastRatio(_backgroundColor, _accentColor)
            const alteredTitleColor = improveContrastRatio(_backgroundColor, _homeTitleColor)

            const newPrimaryIsDark = alteredPrimaryColor.isDark()
            const newAccentIsDark = alteredAccentColor.isDark()
            const newHomeTitleColorIsDark = alteredTitleColor.isDark()

            const _darkNavigationTheme = {
                ...darkNavigationTheme,
                colors: {
                    ...darkNavigationTheme.colors,
                    primary: alteredAccentColor.string(),
                    notification: '#b51010',
                },
            }

            const _lightNavigationTheme = {
                ...defaultNavigationTheme,
                colors: {
                    ...defaultNavigationTheme.colors,
                    primary: alteredAccentColor.string(),
                    notification: '#b51010',
                },
            }

            const cachedColors = {
                oldPrimary: '',
                oldAccent: '',
                oldHomeTitleColor: '',
                primaryIsDark: newPrimaryIsDark,
                accentIsDark: newAccentIsDark,
                homeScreenCategoryTitleIsDark: newHomeTitleColorIsDark,
                navigationTheme: action.darkMode ? _darkNavigationTheme : _lightNavigationTheme,
            }

            if (_primaryColor.string() != alteredPrimaryColor.string()) {
                // changed color
                cachedColors.oldPrimary = _primaryColor.string()
            }
            if (_accentColor.string() != alteredAccentColor.string()) {
                // changed color
                cachedColors.oldAccent = alteredAccentColor.string()
            }
            if (_homeTitleColor.string() != alteredTitleColor.string()) {
                // changed color
                cachedColors.oldHomeTitleColor = _homeTitleColor.string()
            }

            if (action.darkMode) {
                return {
                    ...state,
                    ...cachedColors,
                    dark: true,
                    mode: 'adaptive',
                    colors: {
                        ...state.colors,
                        // background: _darkNavigationTheme.colors.background,
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
                        primary: alteredPrimaryColor.string(),
                        accent: alteredAccentColor.string(),
                        homeScreenCategoryTitle: alteredTitleColor.string(),
                    },
                }
            } else {
                return {
                    ...state,
                    ...cachedColors,
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
                        primary: alteredPrimaryColor.string(),
                        accent: alteredAccentColor.string(),
                        homeScreenCategoryTitle: alteredTitleColor.string(),
                    },
                }
            }
        default:
            return state
    }
}

export default persistReducer(themePersistConfig, theme)

export const actions = {
    saveTheme: (theme) => ({ type: types.SAVE_THEME, theme }),
    toggleDarkMode: (darkMode) => ({ type: types.TOGGLE_DARK_MODE, darkMode }),
}
