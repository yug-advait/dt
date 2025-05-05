import { takeEvery, call, put } from "redux-saga/effects";
import { getSalesDistrictSuccess, getSalesDistrictFail, addSalesDistrict, updateSalesDistrict, deleteSalesDistrict } from "./actions";
import { GET_SALES_DISTRICT_REQUEST, ADD_SALES_DISTRICT_REQUEST, UPDATE_SALES_DISTRICT_REQUEST, DELETE_SALES_DISTRICT_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getSalesDistricts, addUpdateDeleteSalesDistrictsApiCall } from "helpers/Api/api_salesDistricts";

// Get Sales Districts Saga
function* getSalesDistrictsSaga() {
    try{
        const response = yield call(getSalesDistricts);
        yield put(getSalesDistrictSuccess(response));
    }
    catch(error){
        yield put(getSalesDistrictFail(error));
    }
}

// Add Sales Districts Saga
function* addSalesDistrictsSaga(action) {
    const {formData } = action.payload;
    try {
        const response = yield call(addUpdateDeleteSalesDistrictsApiCall, 0, formData,  false);
        yield put(addSalesDistrict(response));
    }
    catch(error){
        yield put(getSalesDistrictFail(error));
    }
}

// Update Designation Saga
function* updateSalesDistrictSaga(action) {
    const {Id, formData} = action.payload;
    try {
        const response = yield call(addUpdateDeleteSalesDistrictsApiCall, Id, formData, false);
        yield put(updateSalesDistrict(response));
    }
    catch(error){
        yield put(getSalesDistrictFail(error));
    }
}
// Delete Designation Saga
function* deleteSalesDistrictSaga(action){
    try {
        const response = yield call(addUpdateDeleteSalesDistrictsApiCall, action.payload,'', true);
        yield put(deleteSalesDistrict(response));
    }
    catch(error){
        yield put(getSalesDistrictFail(error));
    }
}

// Sales District Saga
function* salesDistrictsAllSaga() {
    yield takeEvery(GET_SALES_DISTRICT_REQUEST, getSalesDistrictsSaga);
    yield takeEvery(ADD_SALES_DISTRICT_REQUEST, addSalesDistrictsSaga);
    yield takeEvery(UPDATE_SALES_DISTRICT_REQUEST, updateSalesDistrictSaga);
    yield takeEvery(DELETE_SALES_DISTRICT_REQUEST, deleteSalesDistrictSaga);
}

export {salesDistrictsAllSaga};