import axios from 'axios'

// const BASE_URL = 'https://mobileapi.snosites.net'
const BASE_URL = 'http://localhost:8888/api'

const apiService = {
    createUser: async deviceId => {
        try {
            const response = await axios.post(
                '/user/create',
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
            console.log('thjis is response', response.data)
            return response.data
        } catch (err) {
            console.log('error in fetch all available domains api', err)
            throw err
        }
    }
}

export default apiService
