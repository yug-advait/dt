import { takeEvery, call, put } from "redux-saga/effects";
import { getPurchaseGroupsSuccess, getPurchaseGroupsFail, addPurchaseGroup, updatePurchaseGroup, deletePurchaseGroup} from "./actions";
import { GET_PURCHASE_GROUPS_REQUEST, ADD_PURCHASE_GROUPS_REQUEST, UPDATE_PURCHASE_GROUPS_REQUEST, DELETE_PURCHASE_GROUPS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPurchaseGroups, addUpdateDeletePurchaseGroupsApiCall } from "helpers/Api/api_purchase_group";

// Get Payment Terms Saga
function* getPurchaseGroupsSaga() {
    try{
        const response = yield call(getPurchaseGroups);
        yield put(getPurchaseGroupsSuccess(response));
    }
    catch(error){
        yield put(getPurchaseGroupsFail(error));
    }
}

// Add Payment Terms Saga
function* addPurchaseGroupSaga(action) {
    const {formData } = action.payload;
    try {
        const response = yield call(addUpdateDeletePurchaseGroupsApiCall, 0, formData, false);
        yield put(addPurchaseGroup(response));
    }
    catch(error){
        yield put(getPurchaseGroupsFail(error));
    }
}

// Update Payment Terms Saga
function* updatePurchaseGroupSaga(action) {
    const {Id, formData} = action.payload;
    try {
        const response = yield call(addUpdateDeletePurchaseGroupsApiCall, Id, formData, false);
        yield put(updatePurchaseGroup(response));
    }
    catch(error){
        yield put(getPurchaseGroupsFail(error));
    }
}

// Delete Payment Terms Saga
function* deletePurchaseGroupSaga(action){
    try {
        const response = yield call(addUpdateDeletePurchaseGroupsApiCall, action.payload, '', true);
        yield put(deletePurchaseGroup(response));
    }
    catch(error){
        yield put(getPurchaseGroupsFail(error));
    }
}

// Payment Terms Saga
function* purchaseGroupsAllSaga() {
    yield takeEvery(GET_PURCHASE_GROUPS_REQUEST, getPurchaseGroupsSaga);
    yield takeEvery(ADD_PURCHASE_GROUPS_REQUEST, addPurchaseGroupSaga);
    yield takeEvery(UPDATE_PURCHASE_GROUPS_REQUEST, updatePurchaseGroupSaga);
    yield takeEvery(DELETE_PURCHASE_GROUPS_REQUEST, deletePurchaseGroupSaga);
}

export {purchaseGroupsAllSaga};