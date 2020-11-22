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

let primaryColor = Color(defaultPrimaryColor)
let primaryIsDark = primaryColor.isDark()
let accentColor = Color(defaultAccentColor)
let accentIsDark = accentColor.isDark()

// console.log('navigationDefaultTheme', navigationDefaultTheme)

export const defaultNavigationTheme = {
    dark: false,
    colors: {
        primary: defaultAccentColor,
        background: 'rgb(242, 242, 242)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: '#b51010',
    },
}

export const darkNavigationTheme = {
    dark: true,
    colors: {
        primary: defaultAccentColor,
        background: 'rgb(1, 1, 1)',
        card: 'rgb(18, 18, 18)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        notification: '#b51010',
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
        homeScreenCategoryTitle: defaultAccentColor,
        primaryLightened: primaryColor.alpha(0.2),
        accentLightened: accentColor.alpha(0.7),
        accentWhitened: accentColor.whiten(0.7).alpha(0.2),
        defaultTabIcon: '#b0b0b0',
        grayText: '#9e9e9e',
        red: '#c20c12',
        gray: '#888888',
        lightGray: '#D0D0D0',
    },
    primaryIsDark,
    accentIsDark,
    homeScreenCategoryTitleIsDark: accentIsDark,
    navigationTheme: defaultNavigationTheme,
}
