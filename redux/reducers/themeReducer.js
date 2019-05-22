import {
    SAVE_THEME
} from '../actionCreators/misc'

import { DefaultTheme } from 'react-native-paper';

export function theme(state = { ...DefaultTheme, }, action) {
    switch (action.type) {
        case SAVE_THEME:
            let mode = true;
            if (action.theme.theme.toLowerCase() == 'light') {
                mode = false;
            }
            return {
                ...DefaultTheme,
                dark: mode,
                roundness: 2,
                colors: {
                    ...DefaultTheme.colors,
                    primary: action.theme.primary,
                    accent: action.theme.accent,
                }
            };
        default:
            return state
    }
}