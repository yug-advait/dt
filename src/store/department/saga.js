import { takeEvery,call, put } from "redux-saga/effects";
import { getDepartmentsSuccess, getDepartmentsFail,addDepartment,updateDepartment,deleteDepartment } from "./actions";
import { ADD_DEPARTMENTS_REQUEST,GET_DEPARTMENTS_REQUEST,UPDATE_DEPARTMENTS_REQUEST,DELETE_DEPARTMENTS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getDepartments,addDepartmentApiCall } from "helpers/Api/api_department";

function* departmentSaga() {
  try {
    const response = yield call(getDepartments);
    yield put(getDepartmentsSuccess(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }
}

function* addDepartmentSaga(action) {
  const { departmentId, departmentDescription,isActive } = action.payload; 
  try {
    const response = yield call(addDepartmentApiCall, departmentId, departmentDescription,isActive,0,false)
   yield put(addDepartment(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }
}
function* updateDepartmentSaga(action) {
  const { departmentId, departmentDescription,isActive,Id } = action.payload; 
  try {
    const response = yield call(addDepartmentApiCall, departmentId, departmentDescription,isActive,Id,false)
   yield put(updateDepartment(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }
}
function* deleteDepartmentSaga(action) {
  try {
    const response = yield call(addDepartmentApiCall, '', '','',action.payload,true)
   yield put(deleteDepartment(response))
  } catch (error) {
    yield put(getDepartmentsFail(error))
  }
}

function* departmentAllSaga() {
  yield takeEvery(ADD_DEPARTMENTS_REQUEST, addDepartmentSaga)
  yield takeEvery(UPDATE_DEPARTMENTS_REQUEST, updateDepartmentSaga)
  yield takeEvery(DELETE_DEPARTMENTS_REQUEST, deleteDepartmentSaga)
  yield takeEvery(GET_DEPARTMENTS_REQUEST, departmentSaga)
}

export {departmentAllSaga} 