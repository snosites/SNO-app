import { useEffect, useState } from 'react'
import * as Device from 'expo-device'

export const useIsTablet = () => {
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        getDeviceType = async () => {
            const deviceType = await Device.getDeviceTypeAsync()
            if (Device.DeviceType[deviceType] === 'TABLET') {
                setIsTablet(true)
            } else {
                setIsTablet(false)
            }
        }
        getDeviceType()
    }, [])

    return isTablet
}
