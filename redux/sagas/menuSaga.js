import { put, call, takeLatest } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { requestMenus, receiveMenus, fetchArticles } from '../actions/actions';

function* fetchMenus(action){
    const { domain } = action;
    try {
        yield put(requestMenus())
        const response = yield fetch(`${domain}/wp-json/custom/menus/mobile-app-menu`)
        const menus = yield response.json();
        yield put(receiveMenus(menus))
        yield put(fetchArticles({
            domain,
            category: menus[0].object_id,
            page: 1
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