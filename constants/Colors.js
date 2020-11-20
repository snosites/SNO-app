import { DefaultTheme } from 'react-native-paper'
import { DefaultTheme as navigationDefaultTheme } from '@react-navigation/native'

import Color from 'color'
import Constants from 'expo-constants'
import { getReleaseChannel } from './config'

const version = getReleaseChannel()

const defaultPrimaryColor =
    version === 'sns'
        ? Constants.manifest.extra.highSchool.primary
        : Constants.manifest.extra.college.primary
const defaultAccentColor =
    version === 'sns'
        ? Constants.manifest.extra.highSchool.secondary
        : Constants.manifest.extra.college.secondary

const tintColor = 'blue'

const palette = {
    tintColor,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColor,
    tabBar: '#fefefe',
    errorBackground: 'red',
    errorText: '#fff',
    warningBackground: '#EAEB5E',
    warningText: '#666804',
    noticeBackground: tintColor,
    noticeText: '#fff',
    black: '#1a1917',
    gray: '#888888',
    lightGray: '#D0D0D0',
}

let primaryColor = Color(defaultPrimaryColor)
let primaryIsDark = primaryColor.isDark()
let accentColor = Color(defaultAccentColor)
let accentIsDark = accentColor.isDark()

export default palette
console.log('navigationDefaultTheme', navigationDefaultTheme)
export const defaultNavigationTheme = {
    ...navigationDefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: defaultAccentColor,
    },
}

export const defaultColorTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: defaultPrimaryColor,
        accent: defaultAccentColor,
        background: defaultNavigationTheme.colors.background,
        // background: '#dddddd',
        homeScreenCategoryTitle: defaultAccentColor,
        accentLightened: accentColor.lighten(0.8),
        accentWhitened: accentColor.whiten(0.7).opaquer(0.2),
        grayText: '#9e9e9e',
    },
    primaryIsDark,
    accentIsDark,
    homeScreenCategoryTitleIsDark: accentIsDark,
    extraColors: palette,
    navigationTheme: defaultNavigationTheme,
}
