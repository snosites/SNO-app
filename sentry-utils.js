import Sentry from 'sentry-expo';
import { secrets } from './env';

import Constants from 'expo-constants';

let sentryKey = '';
if (Constants.manifest.releaseChannel === 'sns') {
    sentryKey = Constants.manifest.extra.highSchool.sentryKey;
} else {
    sentryKey = Constants.manifest.extra.college.sentryKey;
}

export function setupSentry() {
    Sentry.config(sentryKey).install();
}