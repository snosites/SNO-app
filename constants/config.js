import Constants from 'expo-constants'

export function getAmplitudeKey() {
    const releaseChannel = Constants.manifest.releaseChannel

    if (releaseChannel === undefined) return null // since releaseChannels are undefined in dev
    if (releaseChannel.indexOf('sns') !== -1) {
        return Constants.manifest.extra.highSchool.amplitudeKey
    }
    if (releaseChannel.indexOf('cns') !== -1) {
        return Constants.manifest.extra.college.amplitudeKey
    }
    return null
}
