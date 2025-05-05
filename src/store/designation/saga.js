import { takeEvery, call, put } from "redux-saga/effects";
import { getDesignationSuccess, getDesignationFail, addDesignation, updateDesignation, deleteDesignation } from "./actions";
import { GET_DESIGNATIONS_REQUEST, ADD_DESIGNATIONS_REQUEST, UPDATE_DESIGNATIONS_REQUEST, DELETE_DESIGNATIONS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getDesignations, addUpdateDeleteDesignationApiCall } from "helpers/Api/api_designation";

// Get Designation Saga
function* getDesignationsSaga() {
    try{
        const response = yield call(getDesignations);
        yield put(getDesignationSuccess(response));
    }
    catch(error){
        yield put(getDesignationFail(error));
    }
}

// Add Designation Saga
function* addDesignationSaga(action) {
    const {formData, selectCompany, selectDepartment, isActive } = action.payload;
    try {
        const response = yield call(addUpdateDeleteDesignationApiCall, 0, formData, selectCompany, selectDepartment, isActive, false);
        yield put(addDesignation(response));
    }
    catch(error){
        yield put(getDesignationFail(error));
    }
}

// Update Designation Saga
function* updateDesignationSaga(action) {
    const {Id, formData, selectCompany, selectDepartment, isActive} = action.payload;
    try {
        const response = yield call(addUpdateDeleteDesignationApiCall, Id, formData, selectCompany, selectDepartment, isActive, false);
        yield put(updateDesignation(response));
    }
    catch(error){
        yield put(getDesignationFail(error));
    }
}
// Delete Designation Saga
function* deleteDesignationSaga(action){
    try {
        const response = yield call(addUpdateDeleteDesignationApiCall, action.payload, '','','','', true);
        yield put(deleteDesignation(response));
    }
    catch(error){
        yield put(getDesignationFail(error));
    }
}

// Designation Saga
function* designationAllSaga() {
    yield takeEvery(GET_DESIGNATIONS_REQUEST, getDesignationsSaga);
    yield takeEvery(ADD_DESIGNATIONS_REQUEST, addDesignationSaga);
    yield takeEvery(UPDATE_DESIGNATIONS_REQUEST, updateDesignationSaga);
    yield takeEvery(DELETE_DESIGNATIONS_REQUEST, deleteDesignationSaga);
}

export {designationAllSaga};