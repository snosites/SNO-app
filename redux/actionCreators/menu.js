// ACTION TYPES

export const FETCH_MENUS = 'FETCH_MENUS'
export const REQUEST_MENUS = 'REQUEST_MENUS'
export const RECEIVE_MENUS = 'RECEIVE_MENUS'
export const RECEIVE_SPLASH = 'RECEIVE_SPLASH'


// MENU ACTIONS

export function fetchMenus(domain, domainId) {
    return {
        type: FETCH_MENUS,
        domain,
        domainId
    }
}

export function requestMenus() {
    return {
        type: REQUEST_MENUS,
    }
}

export function receiveMenus(response) {
    return {
        type: RECEIVE_MENUS,
        response,
    }
}

export function receiveSplash(splash) {
    return {
        type: RECEIVE_SPLASH,
        splash,
    }
}