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
    fetchUser: async apiToken => {
        try {
            const response = await axios.get(`/user?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in createUser api call', err)
            throw err
        }
    },

    updateUser: async (apiToken, postObj) => {
        try {
            const response = await axios.post(`/user?api_token=${apiToken}`, postObj, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in update user api', err, err.repsonse)
            throw err
        }
    },
    deleteUser: async apiToken => {
        try {
            const response = await axios.delete(`/user?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in delete user api', err, err.repsonse)
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

    // subscriptionType either categories or writers
    subscribe: async (apiToken, subscriptionType, ids, domainId) => {
        try {
            const postObj = {
                subscriptionType,
                domainId
            }
            subscriptionType === 'categories'
                ? (postObj.categoryIds = ids)
                : (postObj.writers = ids)
            const response = await axios.post(`/user/subscribe?api_token=${apiToken}`, postObj, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in user subscribe api call', err)
            throw err
        }
    },
    // subscriptionType either categories or writers
    unsubscribe: async (apiToken, subscriptionType, ids) => {
        try {
            const postObj = {
                subscriptionType
            }
            subscriptionType === 'categories'
                ? (postObj.categoryIds = ids)
                : (postObj.writerIds = ids)

            const response = await axios.post(`/user/unsubscribe?api_token=${apiToken}`, postObj, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in user unsubscribe api call', err)
            throw err
        }
    },
    getSubscriptions: async apiToken => {
        try {
            const response = await axios.get(`/user/categories?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in get user subscriptions api call', err)
            throw err
        }
    },
    getWriterSubscriptions: async apiToken => {
        try {
            const response = await axios.get(`/user/writers?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in get user writer subscriptions api call', err)
            throw err
        }
    },
    findDomain: async (apiToken, domainId) => {
        try {
            const response = await axios.get(`/domains/${domainId}?api_token=${apiToken}`, {
                baseURL: BASE_URL
            })
            return response.data
        } catch (err) {
            console.log('error in find domain api call', err)
            throw err
        }
    }
}

export default apiService
