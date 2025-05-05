import { takeEvery, call, put } from "redux-saga/effects";
import { getPaymentTermsSuccess, getPaymentTermsFail, addPaymentTerm, updatePaymentTerm, deletePaymentTerm} from "./actions";
import { GET_PAYMENT_TERMS_REQUEST, ADD_PAYMENT_TERMS_REQUEST, UPDATE_PAYMENT_TERMS_REQUEST, DELETE_PAYMENT_TERMS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPaymentTerms, addUpdateDeletePaymentTermsApiCall } from "helpers/Api/api_payment_terms";

// Get Payment Terms Saga
function* getPaymentTermsSaga() {
    try{
        const response = yield call(getPaymentTerms);
        yield put(getPaymentTermsSuccess(response));
    }
    catch(error){
        yield put(getPaymentTermsFail(error));
    }
}

// Add Payment Terms Saga
function* addPaymentTermSaga(action) {
    const {formData } = action.payload;
    try {
        const response = yield call(addUpdateDeletePaymentTermsApiCall, 0, formData, false);
        yield put(addPaymentTerm(response));
    }
    catch(error){
        yield put(getPaymentTermsFail(error));
    }
}

// Update Payment Terms Saga
function* updatePaymentTermSaga(action) {
    const {Id, formData} = action.payload;
    try {
        const response = yield call(addUpdateDeletePaymentTermsApiCall, Id, formData, false);
        yield put(updatePaymentTerm(response));
    }
    catch(error){
        yield put(getPaymentTermsFail(error));
    }
}

// Delete Payment Terms Saga
function* deletePaymentTermSaga(action){
    try {
        const response = yield call(addUpdateDeletePaymentTermsApiCall, action.payload, '', true);
        yield put(deletePaymentTerm(response));
    }
    catch(error){
        yield put(getPaymentTermsFail(error));
    }
}

// Payment Terms Saga
function* paymentTermsAllSaga() {
    yield takeEvery(GET_PAYMENT_TERMS_REQUEST, getPaymentTermsSaga);
    yield takeEvery(ADD_PAYMENT_TERMS_REQUEST, addPaymentTermSaga);
    yield takeEvery(UPDATE_PAYMENT_TERMS_REQUEST, updatePaymentTermSaga);
    yield takeEvery(DELETE_PAYMENT_TERMS_REQUEST, deletePaymentTermSaga);
}

export {paymentTermsAllSaga};