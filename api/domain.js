import axios from 'axios'

const BASE_URL = 'https://mobileapi.snosites.com/api'
// const BASE_URL = 'http://localhost:8888/api'

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
    getCustomHeader: async domainUrl => {
        try {
            const headerId = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_nav_header`
            )
            if (!headerId.data.result) {
                throw new Error('cannot get custom header ID')
            }
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/media?include=${headerId.data.result}`
            )
            return response.data
        } catch (err) {
            console.log('error in get custom header api', err, err.response)
            throw err
        }
    },
    getCustomHeaderLogo: async domainUrl => {
        try {
            const headerLogoId = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_header_logo`
            )
            if (!headerLogoId.data.result) {
                throw new Error('cannot get custom header logo ID')
            }
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/media?include=${headerLogoId.data.result}`
            )
            return response.data
        } catch (err) {
            console.log('error in get custom header logo api', err, err.response)
            throw err
        }
    },
    getCustomTheme: async domainUrl => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_theme`
            )
            return response.data
        } catch (err) {
            console.log('error in get custom theme api', err, err.response)
            throw err
        }
    },
    getCustomPrimaryColor: async domainUrl => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_primary_color`
            )
            return response.data
        } catch (err) {
            console.log('error in get custom primary color api', err, err.response)
            throw err
        }
    },
    getCustomAccentColor: async domainUrl => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_accent_color`
            )
            return response.data
        } catch (err) {
            console.log('error in get custom primary color api', err, err.response)
            throw err
        }
    },
    fetchArticles: async options => {
        const { domainUrl, category, page } = options
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/posts?categories=${category}&page=${page}`, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch articles api', err, err.response)
            throw err
        }
    },
    fetchArticle: async (domainUrl, articleId) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/posts/${articleId}`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch article api', err, err.response)
            throw err
        }
    },
    searchArticles: async options => {
        const { domainUrl, searchTerm, page } = options
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/posts?search=${searchTerm}&page=${page}`
            )
            return response.data
        } catch (err) {
            console.log('error in search articles api', err, err.response)
            throw err
        }
    },
    fetchProfileArticles: async (domainUrl, writerTermId) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/author_content?authorTermId=${writerTermId}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch profile articles api', err, err.response)
            throw err
        }
    },
    fetchProfiles: async (domainUrl, year) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/get_profiles?year=${year}`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch profiles api', err, err.response)
            throw err
        }
    },
    addComment: async (domainUrl, postObj) => {
        try {
            const response = await axios.post(
                `https://${domainUrl}/wp-json/wp/v2/comments`,
                postObj
            )
            return response.data
        } catch (err) {
            console.log('error in add comment api', err, err.response)
            throw err
        }
    },
    fetchRecentArticles: async options => {
        const { domainUrl, categories, page } = options
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/posts?categories=${categories.join(
                    ','
                )}&page=${page}`
            )
            return response.data
        } catch (err) {
            console.log('error in fetch recent articles api', err, err.response)
            throw err
        }
    }
}

export default domainApiService
