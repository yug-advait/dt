import { takeEvery, call, put } from "redux-saga/effects";
import { getIncoTermsSuccess, getIncoTermsFail, addIncoTerm, updateIncoTerm, deleteIncoTerm } from "./actions";
import { GET_INCO_TERMS_REQUEST, ADD_INCO_TERMS_REQUEST, UPDATE_INCO_TERMS_REQUEST, DELETE_INCO_TERMS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getIncoTerms, addUpdateDeleteIncoTermsApiCall } from "helpers/Api/api_incoTerms";

// Get Revenue Indicator Saga
function* getIncoTermsSaga(action) {
    const { inco_term_type } = action.payload;
    try {
        const response = yield call(getIncoTerms, inco_term_type);
        yield put(getIncoTermsSuccess(response));
    }
    catch (error) {
        yield put(getIncoTermsFail(error));
    }
}

// Add Revenue Indicator Saga
function* addIncoTermSaga(action) {
    const { formData, inco_term_type } = action.payload;
    try {
        const response = yield call(addUpdateDeleteIncoTermsApiCall, 0, formData, false, inco_term_type);
        yield put(addIncoTerm(response));
    }
    catch (error) {
        yield put(getIncoTermsFail(error));
    }
}

// Update Revenue Indicator Saga
function* updateIncoTermSaga(action) {
    const { Id, formData, inco_term_type } = action.payload;
    try {
        const response = yield call(addUpdateDeleteIncoTermsApiCall, Id, formData, false, inco_term_type);
        yield put(updateIncoTerm(response));
    }
    catch (error) {
        yield put(getIncoTermsFail(error));
    }
}

// Delete Revenue Indicator Saga
function* deleteIncoTermSaga(action) {

    const { Id, inco_term_type } = action.payload;
    try {
        const response = yield call(addUpdateDeleteIncoTermsApiCall, Id, '', true, inco_term_type);
        yield put(deleteIncoTerm(response));
    }
    catch (error) {
        yield put(getIncoTermsFail(error));
    }
}

// Revenue Indicator Saga
function* incoTermsAllSaga() {
    yield takeEvery(GET_INCO_TERMS_REQUEST, getIncoTermsSaga);
    yield takeEvery(ADD_INCO_TERMS_REQUEST, addIncoTermSaga);
    yield takeEvery(UPDATE_INCO_TERMS_REQUEST, updateIncoTermSaga);
    yield takeEvery(DELETE_INCO_TERMS_REQUEST, deleteIncoTermSaga);
}

export { incoTermsAllSaga };