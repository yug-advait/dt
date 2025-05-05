import { takeEvery, call, put } from "redux-saga/effects";
import { getRevenueIndicatorSuccess, getRevenueIndicatorFail, addRevenueIndicator, updateRevenueIndicator, deleteRevenueIndicator } from "./actions";
import { GET_REVENUE_INDICATORS_REQUEST, ADD_REVENUE_INDICATORS_REQUEST, UPDATE_REVENUE_INDICATORS_REQUEST, DELETE_REVENUE_INDICATORS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getRevenueIndicators, addUpdateDeleteRevenueIndicators } from "helpers/Api/api_revenueIndicator";

// Get Revenue Indicator Saga
function* getRevenueIndicatorsSaga(action) {
    const { revenue_indicator_type } = action.payload;
    try{
        const response = yield call(getRevenueIndicators, revenue_indicator_type);
        yield put(getRevenueIndicatorSuccess(response));
    }
    catch(error){
        yield put(getRevenueIndicatorFail(error));
    }
}

// Add Revenue Indicator Saga
function* addRevenueIndicatorSaga(action) {
    const {formData,revenue_indicator_type } = action.payload;
    try {
        const response = yield call(addUpdateDeleteRevenueIndicators, 0, formData, false,revenue_indicator_type);
        yield put(addRevenueIndicator(response));
    }
    catch(error){
        yield put(getRevenueIndicatorFail(error));
    }
}

// Update Revenue Indicator Saga
function* updateRevenueIndicatorSaga(action) {
    const {Id, formData, revenue_indicator_type} = action.payload;
    try {
        const response = yield call(addUpdateDeleteRevenueIndicators, Id, formData, false,revenue_indicator_type);
        yield put(updateRevenueIndicator(response));
    }
    catch(error){
        yield put(getRevenueIndicatorFail(error));
    }
}

// Delete Revenue Indicator Saga
function* deleteRevenueIndicatorSaga(action){

    const {Id, revenue_indicator_type} = action.payload;
    try {
        const response = yield call(addUpdateDeleteRevenueIndicators, Id, '', true, revenue_indicator_type);
        yield put(deleteRevenueIndicator(response));
    }
    catch(error){
        yield put(getRevenueIndicatorFail(error));
    }
}

// Revenue Indicator Saga
function* revenueIndicatorAllSaga() {
    yield takeEvery(GET_REVENUE_INDICATORS_REQUEST, getRevenueIndicatorsSaga);
    yield takeEvery(ADD_REVENUE_INDICATORS_REQUEST, addRevenueIndicatorSaga);
    yield takeEvery(UPDATE_REVENUE_INDICATORS_REQUEST, updateRevenueIndicatorSaga);
    yield takeEvery(DELETE_REVENUE_INDICATORS_REQUEST, deleteRevenueIndicatorSaga);
}

export {revenueIndicatorAllSaga};