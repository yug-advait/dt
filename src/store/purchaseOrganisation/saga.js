import { takeEvery, call, put } from "redux-saga/effects";
import { getPurchaseOrganisationSuccess, getPurchaseOrganisationFail, addPurchaseOrganisation, updatePurchaseOrganisation, deletePurchaseOrganisation } from "./actions";
import { GET_PURCHASE_ORGANISATION_REQUEST, ADD_PURCHASE_ORGANISATION_REQUEST, UPDATE_PURCHASE_ORGANISATION_REQUEST, DELETE_PURCHASE_ORGANISATION_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPurchaseOrganisations, addUpdateDeletePurchaseOrganisationApiCall } from "helpers/Api/api_purchaseOrganisations";

// Get PurchaseOrganisation Saga
function* getPurchaseOrganisationsSaga() {
    try{
        const response = yield call(getPurchaseOrganisations);
        yield put(getPurchaseOrganisationSuccess(response));
    }
    catch(error){
        yield put(getPurchaseOrganisationFail(error));
    }
}

// Add PurchaseOrganisation Saga
function* addPurchaseOrganisationSaga(action) {
    const {formData, selectCompany, selectPlant, selectPurchaseGroup, } = action.payload;
    try {
        const response = yield call(addUpdateDeletePurchaseOrganisationApiCall, 0, formData, selectCompany, selectPlant, selectPurchaseGroup, false);
        yield put(addPurchaseOrganisation(response));
    }
    catch(error){
        yield put(getPurchaseOrganisationFail(error));
    }
}

// Update Purchase Organisation Saga
function* updatePurchaseOrganisationSaga(action) {
    const {Id, formData, selectCompany, selectPlant, selectPurchaseGroup,} = action.payload;
    try {
        const response = yield call(addUpdateDeletePurchaseOrganisationApiCall, Id, formData, selectCompany, selectPlant, selectPurchaseGroup, false);
        yield put(updatePurchaseOrganisation(response));
    }
    catch(error){
        yield put(getPurchaseOrganisationFail(error));
    }
}
// Delete Purchase Organisation Saga
function* deletePurchaseOrganisationSaga(action){
    try {
        const response = yield call(addUpdateDeletePurchaseOrganisationApiCall, action.payload, '','','','', true);
        yield put(deletePurchaseOrganisation(response));
    }
    catch(error){
        yield put(getPurchaseOrganisationFail(error));
    }
}

// PurchaseOrganisation Saga
function* purchaseOrganisationAllSaga() {
    yield takeEvery(GET_PURCHASE_ORGANISATION_REQUEST, getPurchaseOrganisationsSaga);
    yield takeEvery(ADD_PURCHASE_ORGANISATION_REQUEST, addPurchaseOrganisationSaga);
    yield takeEvery(UPDATE_PURCHASE_ORGANISATION_REQUEST, updatePurchaseOrganisationSaga);
    yield takeEvery(DELETE_PURCHASE_ORGANISATION_REQUEST, deletePurchaseOrganisationSaga);
}

export {purchaseOrganisationAllSaga};