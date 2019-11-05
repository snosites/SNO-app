import axios from 'axios'

// const BASE_URL = 'https://mobileapi.snosites.net'
const BASE_URL = 'http://localhost:8888/api'

axios.interceptors.response.use(function(response) {
    const contentType = response.headers['content-type']
    if (contentType && contentType.indexOf('application/json') !== -1) {
        return response
    } else {
        throw new Error('not a valid JSON response')
    }
})

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
    getMobileMenu: async domainUrl => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/menus/mobile-app-menu`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch mobile menu api', err, err.response)
            throw err
        }
    },
    getDbCategories: async (apiToken, domainId) => {
        try {
            const response = await axios.get(`/category/${domainId}?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in fetch DB categories api', err, err.response)
            throw err
        }
    },
    addDbCategory: async (apiToken, postObj) => {
        try {
            const response = await axios.post(`/category/create?api_token=${apiToken}`, postObj, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in fetch DB categories api', err, err.response)
            throw err
        }
    },
    deleteDbCategories: async (apiToken, postObj) => {
        try {
            const response = await axios.delete(`/category?api_token=${apiToken}`, {
                baseURL: BASE_URL,
                data: postObj
            })
            return response.data
        } catch (err) {
            console.log('error in fetch DB categories api', err, err.response)
            throw err
        }
    },
}

export default domainApiService
