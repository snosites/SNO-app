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

export const getWritersString = (writers) => {
    let str = ''

    for (let i = 0; i < writers.length; i++) {
        if (i === writers.length - 2) {
            str += `${writers[i]} & `
        } else if (i === writers.length - 1) {
            str += `${writers[i]}`
        } else {
            str += `${writers[i]}, `
        }
    }
    return str
}
