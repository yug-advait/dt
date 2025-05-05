import { takeEvery, call, put } from "redux-saga/effects";
import { getWithHoldingTaxTypeSuccess, getWithHoldingTaxTypeFail, addWithHoldingTaxType, updateWitholdingTaxType, deleteWitholdingTaxType } from "./actions";
import { GET_WITHHOLDING_TAX_TYPES_REQUEST, ADD_WITHHOLDING_TAX_TYPES_REQUEST, UPDATE_WITHHOLDING_TAX_TYPES_REQUEST, DELETE_WITHHOLDING_TAX_TYPES_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getWithholdingTaxTypes, addUpdateDeleteWithholdingTaxTypes } from "helpers/Api/api_withholdingTaxType";

// Get withHoldingTaxTypes Saga
function* getWithHoldingTaxTypesSaga() {
    try{
        const response = yield call(getWithholdingTaxTypes);
        yield put(getWithHoldingTaxTypeSuccess(response));
    }
    catch(error){
        yield put(getRevenueIndicatorFail(error));
    }
}

// Add withHoldingTaxTypes Saga
function* addWithHoldingTaxTypesSaga(action) {
    const {formData, selectCountry } = action.payload;
    try {
        const response = yield call(addUpdateDeleteWithholdingTaxTypes, 0, formData, selectCountry, false);
        yield put(addWithHoldingTaxType(response));
    }
    catch(error){
        yield put(getWithHoldingTaxTypeFail(error));
    }
}

// Update withHoldingTaxTypes Saga
function* updateWithHoldingTaxTypeSaga(action) {
    const {Id, formData, selectCountry} = action.payload;
    try {
        const response = yield call(addUpdateDeleteWithholdingTaxTypes, Id, formData, selectCountry, false);
        yield put(updateWitholdingTaxType(response));
    }
    catch(error){
        yield put(getWithHoldingTaxTypeFail(error));
    }
}

// Delete withHoldingTaxTypes Saga
function* deleteWitholdingTaxTypeSaga(action){
    try {
        const response = yield call(addUpdateDeleteWithholdingTaxTypes, action.payload, '','', true);
        yield put(deleteWitholdingTaxType(response));
    }
    catch(error){
        yield put(getWithHoldingTaxTypeFail(error));
    }
}

// withHoldingTaxTypes Saga
function* withHoldingTaxTypeAllSaga() {
    yield takeEvery(GET_WITHHOLDING_TAX_TYPES_REQUEST, getWithHoldingTaxTypesSaga);
    yield takeEvery(ADD_WITHHOLDING_TAX_TYPES_REQUEST, addWithHoldingTaxTypesSaga);
    yield takeEvery(UPDATE_WITHHOLDING_TAX_TYPES_REQUEST, updateWithHoldingTaxTypeSaga);
    yield takeEvery(DELETE_WITHHOLDING_TAX_TYPES_REQUEST, deleteWitholdingTaxTypeSaga);
}

export {withHoldingTaxTypeAllSaga};
