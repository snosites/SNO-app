import Constants from 'expo-constants'

// if not standalone then mock functions
if (Constants.appOwnership !== 'standalone') {
    module.exports = {
        subscribe: () => console.log('Branch subscribe method is being mocked in development!'),
        unsubscribe: () => console.log('Branch unsubscribe method is being mocked in development!'),
        createBranchUniversalObject: async () => ({
            showShareSheet: console.log('not available in sim'),
        }),
        getFirstReferringParams: () => ({ $canonical_url: null }),
    }
} else {
    module.exports = require('expo-branch')
}
