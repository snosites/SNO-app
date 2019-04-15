import { put, call, takeLatest, all } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, receiveMenus, fetchArticlesIfNeeded } from '../actions/actions';

function* fetchMenus(action){
    const { domain } = action;
    try {
        yield put(requestMenus())
        const response = yield fetch(`${domain}/wp-json/custom/menus/mobile-app-menu`)
        const menus = yield response.json();
        const [result, result2] = yield all([
            call(fetch, `${domain}/wp-json/custom/header_image?type=header-image-small`),
            call(fetch, `${domain}/wp-json/custom/header_image?type=mini-logo`)
        ]);
        const headerImage = yield result.json();
        const headerSmall = yield result2.json();
        yield put(receiveMenus({
            menus,
            header: headerImage.image,
            headerSmall: headerSmall.image
        }))
        yield put(fetchArticlesIfNeeded({
            domain,
            category: menus[0].object_id,
        }))
    }
    catch(err) {
        console.log('error fetching menus in saga', err)
    }
}

function* menuSaga() {
    yield takeLatest('FETCH_MENUS', fetchMenus);
}

export default menuSaga;