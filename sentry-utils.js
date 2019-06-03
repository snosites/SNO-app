import Sentry from 'sentry-expo';
import { secrets } from './env';

// sentry setup
Sentry.enableInExpoDevelopment = true;


export function setupSentry() {
    Sentry.config(secrets.SENTRYAPI).install();
}