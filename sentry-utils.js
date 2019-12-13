import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'
import { getReleaseChannel } from './constants/config'

const version = getReleaseChannel()

let sentryKey = Constants.manifest.extra.college.sentryKey;
if (version === 'sns') {
    sentryKey = Constants.manifest.extra.highSchool.sentryKey
} else {
    sentryKey = Constants.manifest.extra.college.sentryKey
}

export function setupSentry() {
    Sentry.init({
        dsn: sentryKey,
        enableInExpoDevelopment: true,
        debug: true
    })
    Sentry.setRelease(Constants.manifest.revisionId)
}