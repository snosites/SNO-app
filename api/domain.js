import axios from 'axios'

const BASE_URL = 'https://mobileapi.snosites.com/api'
// const BASE_URL = 'http://localhost:8888/api'

axios.interceptors.response.use(function (response) {
    const contentType = response.headers['content-type']
    if (contentType && contentType.indexOf('application/json') !== -1) {
        return response
    } else {
        throw new Error('not a valid JSON response')
    }
})

const domainApiService = {
    getSplashScreenId: async (domainUrl) => {
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
                `https://${domainUrl}/wp-json/custom/menus/mobile-app-menu`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
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
                baseURL: BASE_URL,
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
                baseURL: BASE_URL,
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
                data: postObj,
            })
            return response.data
        } catch (err) {
            console.log('error in fetch DB categories api', err, err.response)
            throw err
        }
    },
    getCustomHeader: async (domainUrl) => {
        try {
            const headerId = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_nav_header`
            )
            if (!headerId.data.result) {
                return false
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
    getCustomHeaderLogo: async (domainUrl) => {
        try {
            const headerLogoId = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_header_logo`
            )
            if (!headerLogoId.data.result) {
                return false
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
    getCustomTheme: async (domainUrl) => {
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
    getCommentsToggle: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=comments&theme_mod=true`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get comments toggle api', err, err.response)
            throw err
        }
    },
    getCustomPrimaryColor: async (domainUrl) => {
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
    getCustomAccentColor: async (domainUrl) => {
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
    getCustomHomeCategoryColor: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_home_category_color`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get custom home category color api', err, err.response)
            throw err
        }
    },
    getStoryListStyle: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_list_type`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get story list style api', err, err.response)
            throw err
        }
    },
    getHomeScreenCategory: async (domainUrl, categoryNumber) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_home_category_${categoryNumber}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get home screen category api', err, err.response)
            throw err
        }
    },
    getHomeScreenCategoryAmount: async (domainUrl, categoryNumber) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_home_category_${categoryNumber}_amount`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get home screen category amount api', err, err.response)
            throw err
        }
    },
    getHomeScreenListStyle: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_home_list_type`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get home list style api', err, err.response)
            throw err
        }
    },
    getAdOptions: async (domainUrl) => {
        try {
            const response = await axios.get(`https://${domainUrl}/wp-json/sns-v2/app-ad-options`)
            return response.data
        } catch (err) {
            console.log('error in fetch app ad options api', err)
            throw err
        }
    },
    getAds: async (domainUrl, adType) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/app-ads?ad_position=${adType}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch app ads api', err)
            throw err
        }
    },
    getSnoAdInfo: async (domainUrl) => {
        try {
            const response = await axios.get(`https://${domainUrl}/wp-json/sns-v2/sno-ads`, {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            })
            return response.data
        } catch (err) {
            console.log('error in fetch app ads api', err)
            throw err
        }
    },
    getSnoAdImage: async (adSpotId) => {
        try {
            const response = await axios.get(`https://snoads.com/api/v1/adspot/${adSpotId}/serve`, {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            })
            console.log('response daaaata', response)
            return response.data
        } catch (err) {
            console.log('error in fetch sno ad image api', err, err.response)
            throw err
        }
    },
    sendAdAnalytic: async (domainUrl, imageId, field) => {
        try {
            const response = await axios.post(
                `https://${domainUrl}/wp-json/sns-v2/ad-analytics`,
                { image_id: imageId, field },
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch app ads api', err, err.response)
            throw err
        }
    },
    getHomeScreenMode: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/custom/option?type=sns_legacy_home`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get home mode api', err, err.response)
            throw err
        }
    },
    fetchChildCategories: async (options) => {
        const { domainUrl, parentCategoryId } = options
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/categories?parent=${parentCategoryId}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch parent categories api', err, err.response)
            throw err
        }
    },
    fetchArticles: async (options) => {
        const { domainUrl, category, childCategoryIds, page } = options
        let childCatIds = childCategoryIds
        if (!childCategoryIds) childCatIds = ''
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/posts?categories=${category},${childCatIds}&page=${page}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch articles api', err, err.response)
            if (
                err.response &&
                err.response.data &&
                err.response.data.code &&
                err.response.data.code === 'rest_post_invalid_page_number'
            ) {
                return []
            }
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
    searchArticles: async (options) => {
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
                        'Cache-Control': 'no-cache',
                    },
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
    fetchRecentArticles: async (options) => {
        const { domainUrl, categories, page } = options
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/wp/v2/posts?categories=${categories.join(
                    ','
                )}&page=${page}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in fetch recent articles api', err, err.response)
            throw err
        }
    },
    getSportCenterOption: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/sportcenter_check`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in get sportcenter option api', err, err.response)
            throw err
        }
    },
    addSchoolSub: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/school-subs?analytics_key=yi0htg0e6fq650jp&add_school_sub=true`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in add school sub api', err, err.response)
            throw err
        }
    },
    removeSchoolSub: async (domainUrl) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/school-subs?analytics_key=yi0htg0e6fq650jp&remove_school_sub=true`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in remove school sub api', err, err.response)
            throw err
        }
    },
    addStoryView: async (domainUrl, postId) => {
        try {
            const response = await axios.get(
                `https://${domainUrl}/wp-json/sns-v2/analytics?analytics_key=yi0htg0e6fq650jp&post_id=${postId}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            )
            return response.data
        } catch (err) {
            console.log('error in add story view api', err, err.response)
            throw err
        }
    },
}

export default domainApiService
