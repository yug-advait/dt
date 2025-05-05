import { takeEvery,call, put } from "redux-saga/effects";
import { getEmployeeGroupSuccess, getEmployeeGroupFail,addEmployeeGroup,updateEmployeeGroup,deleteEmployeeGroup } from "./actions";
import { ADD_EMPLOYEEGROUP_REQUEST,GET_EMPLOYEEGROUP_REQUEST,UPDATE_EMPLOYEEGROUP_REQUEST,DELETE_EMPLOYEEGROUP_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getEmployeeGroup,addEmployeeGroupApiCall } from "helpers/Api/api_employeeGroup";

function* accountgroupsSaga() {
  try {
    const response = yield call(getEmployeeGroup)
    yield put(getEmployeeGroupSuccess(response))
  } catch (error) {
    yield put(getEmployeeGroupFail(error));
  }
}

function* addEmployeeGroupSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addEmployeeGroupApiCall,formData,isActive,0,false)
   yield put(addEmployeeGroup(response));
  } catch (error) {
    yield put(getEmployeeGroupFail(error));
  }
}
function* updateEmployeeGroupSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addEmployeeGroupApiCall,formData,isActive,Id,false)
   yield put(updateEmployeeGroup(response));
  } catch (error) {
    yield put(getEmployeeGroupFail(error));
  }
}
function* deleteEmployeeGroupSaga(action) {
  try {
    const response = yield call(addEmployeeGroupApiCall,'','',action.payload,true)
   yield put(deleteEmployeeGroup(response))
  } catch (error) {
    yield put(getEmployeeGroupFail(error))
  }
}

function* employeeGroupAllSaga() {
  yield takeEvery(ADD_EMPLOYEEGROUP_REQUEST, addEmployeeGroupSaga)
  yield takeEvery(UPDATE_EMPLOYEEGROUP_REQUEST, updateEmployeeGroupSaga)
  yield takeEvery(DELETE_EMPLOYEEGROUP_REQUEST, deleteEmployeeGroupSaga)
  yield takeEvery(GET_EMPLOYEEGROUP_REQUEST, accountgroupsSaga)
}

export {employeeGroupAllSaga} 