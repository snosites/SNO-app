import axios from 'axios'

// const BASE_URL = 'https://mobileapi.snosites.net'
const BASE_URL = 'http://localhost:8888/api'

const apiService = {
    findOrCreateUser: async deviceId => {
        try {
            const response = await axios.post(
                '/user/find-or-create',
                { deviceId },
                {
                    baseURL: BASE_URL
                }
            )
            return response.data
        } catch (err) {
            console.log('error in createUser api call', err)
            throw err
        }
    },
    fetchAvailableDomains: async (apiToken, version) => {
        try {
            const response = await axios.get(`/domains/all/${version}?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in fetch all available domains api', err)
            throw err
        }
    },
    searchAvailableDomains: async (apiToken, version, searchTerm) => {
        try {
            const response = await axios.get(
                `/domains/search/${searchTerm}/${version}?api_token=${apiToken}`,
                {
                    baseURL: BASE_URL
                }
            )
            return response.data
        } catch (err) {
            console.log('error in search available domains api', err)
            throw err
        }
    },
    subscribe: async (apiToken, subscriptionType, ids) => {
        try {
            const response = await axios.post(
                `/user/subscribe?api_token=${apiToken}`,
                {
                    subscriptionType,
                    ids
                },
                {
                    baseURL: BASE_URL
                }
            )
            return response.data
        } catch(err) {
            console.log('error in user subscribe api call', err)
            throw err
        }
    }
}

export default apiService
