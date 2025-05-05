import { takeEvery,call, put } from "redux-saga/effects";
import { getEmployeeMasterSuccess, getEmployeeMasterFail,addEmployeeMaster,updateEmployeeMaster,deleteEmployeeMaster } from "./actions";
import { ADD_EMPLOYEEMASTER_REQUEST,GET_EMPLOYEEMASTER_REQUEST,UPDATE_EMPLOYEEMASTER_REQUEST,DELETE_EMPLOYEEMASTER_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getEmployeeMaster,addEmployeeMasterApiCall } from "helpers/Api/api_employeeMaster";

function* EmployeeMasterSaga() {
  try {
    const response = yield call(getEmployeeMaster)
    yield put(getEmployeeMasterSuccess(response))
  } catch (error) {
    yield put(getEmployeeMasterFail(error));
  }
}

function* addEmployeeMasterSaga(action) {
  const {formData } = action.payload
  try {
    const response = yield call(addEmployeeMasterApiCall,formData,true,0,false)
   yield put(addEmployeeMaster(response));
  } catch (error) {
    yield put(getEmployeeMasterFail(error));
  }
}
function* updateEmployeeMasterSaga(action) {
  const {formData,Id } = action.payload
  try {
    const response = yield call(addEmployeeMasterApiCall,formData,true,Id,false)
   yield put(updateEmployeeMaster(response));
  } catch (error) {
    yield put(getEmployeeMasterFail(error));
  }
}
function* deleteEmployeeMasterSaga(action) {
  try {
    const response = yield call(addEmployeeMasterApiCall,'','',action.payload,true)
   yield put(deleteEmployeeMaster(response))
  } catch (error) {
    yield put(getEmployeeMasterFail(error))
  }
}

function* employeeMasterAllSaga() {
  yield takeEvery(ADD_EMPLOYEEMASTER_REQUEST, addEmployeeMasterSaga)
  yield takeEvery(UPDATE_EMPLOYEEMASTER_REQUEST, updateEmployeeMasterSaga)
  yield takeEvery(DELETE_EMPLOYEEMASTER_REQUEST, deleteEmployeeMasterSaga)
  yield takeEvery(GET_EMPLOYEEMASTER_REQUEST, EmployeeMasterSaga)
}

export {employeeMasterAllSaga} 