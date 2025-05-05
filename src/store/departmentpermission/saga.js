import { takeEvery,call, put } from "redux-saga/effects";
import { getDepartmentPermissionSuccess, getDepartmentPermissionFail,addDepartmentPermission,updateDepartmentPermission,
  deleteDepartmentPermission } from "./actions";
import { ADD_DEPARTMENTPERMISSION_REQUEST,GET_DEPARTMENTPERMISSION_REQUEST,UPDATE_DEPARTMENTPERMISSION_REQUEST,DELETE_DEPARTMENTPERMISSION_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getDepartmentPermission,addDepartmentPermissionApiCall } from "helpers/Api/api_departmentPermission";

function* departmentPermissionSaga() {
  try {
    const response = yield call(getDepartmentPermission)
    yield put(getDepartmentPermissionSuccess(response))
  } catch (error) {
    yield put(getDepartmentPermissionFail(error));
  }
}

function* addDepartmentPermissionSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addDepartmentPermissionApiCall,formData,isActive,0,false)
   yield put(addDepartmentPermission(response));
  } catch (error) {
    yield put(getDepartmentPermissionFail(error));
  }
}
function* updateDepartmentPermissionSaga(action) {
  const {formData,menuList } = action.payload
  try {
    const response = yield call(addDepartmentPermissionApiCall,formData,menuList)
   yield put(updateDepartmentPermission(response));
  } catch (error) {
    yield put(getDepartmentPermissionFail(error));
  }
}
function* deleteDepartmentPermissionSaga(action) {
  try {
    const response = yield call(addDepartmentPermissionApiCall,'','',action.payload,true)
   yield put(deleteDepartmentPermission(response))
  } catch (error) {
    yield put(getDepartmentPermissionFail(error))
  }
}

function* departmentPermissionAllSaga() {
  yield takeEvery(ADD_DEPARTMENTPERMISSION_REQUEST, addDepartmentPermissionSaga)
  yield takeEvery(UPDATE_DEPARTMENTPERMISSION_REQUEST, updateDepartmentPermissionSaga)
  yield takeEvery(DELETE_DEPARTMENTPERMISSION_REQUEST, deleteDepartmentPermissionSaga)
  yield takeEvery(GET_DEPARTMENTPERMISSION_REQUEST, departmentPermissionSaga)
}

export {departmentPermissionAllSaga} 