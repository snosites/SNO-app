import Sentry from 'sentry-expo';
import { secrets } from './env';




export function setupSentry() {
    Sentry.config(secrets.SENTRYAPI).install();
}