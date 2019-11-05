import axios from 'axios'

// const BASE_URL = 'https://mobileapi.snosites.net'
const BASE_URL = 'http://localhost:8888/api'

const domainApiService = {
    getSplashScreenId: async domainUrl => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_splash_screen`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch splash screen ID api', err)
            throw err
        }
    },
    getSplashScreenImage: async (domainUrl, splashScreenId) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/media?include=${splashScreenId}`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch splash screen image api', err)
            throw err
        }
    },
    getMobileMenu: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/menus/mobile-app-menu`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch mobile menu api', err)
            throw err
        }
    },
}

export default domainApiService
