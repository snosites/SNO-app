import React, { useEffect } from 'react'
import { View, Alert, Platform } from 'react-native'

import Constants from 'expo-constants'
import { Linking } from 'expo'

const isIos = Platform.OS === 'ios'
const appVersion = Constants.manifest.releaseChannel // sns / cns

const getAppStoreUrl = () => {
    if(isIos) {
        if(appVersion === 'sns'){
            //ios -sns
            return 'https://apps.apple.com/us/app/student-news-source/id1463449523?ls=1'
        } else {
            //ios cns
            return 'https://apps.apple.com/us/app/college-news-source/id1472403468?ls=1'
        }
    } else {
        if (appVersion === 'sns') {
            //android -sns
            return 'market://details?id=com.snosites.studentnewssource'
        } else {
            //android -cns
            return 'market://details?id=com.snosites.collegenewssource'
        }
    }
}

const appStoreUrl = getAppStoreUrl()

const UpdateApp = props => {
    useEffect(() => {
         Alert.alert(
             'There is an update available',
             `You need to update your app to the lastest version.  You may have to turn your push notification settings back on after the update.`,
             [
                 {
                     text: 'Proceed',
                     onPress: () => {
                         _openStore()
                     }
                 }
             ],
             { cancelable: false }
         )
    },[])

    const _openStore = () => {
        Linking.openURL(appStoreUrl).catch(err => console.log('error opening app store', err))
    }


    return (
        <View></View>
    )
}

export default UpdateApp
