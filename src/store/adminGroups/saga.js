import { takeEvery,call, put } from "redux-saga/effects";
import { getAdminGroupsSuccess, getAdminGroupsFail,addAdminGroups,updateAdminGroups,
  deleteAdminGroups } from "./actions";
import { ADD_ADMINGROUPS_REQUEST,GET_ADMINGROUPS_REQUEST,UPDATE_ADMINGROUPS_REQUEST,DELETE_ADMINGROUPS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getAdminGroups,addAdminGroupsApiCall } from "helpers/Api/api_adminGroups";

function* adminGroupsSaga() {
  try {
    const response = yield call(getAdminGroups)
    yield put(getAdminGroupsSuccess(response))
  } catch (error) {
    yield put(getAdminGroupsFail(error));
  }
}

function* addAdminGroupsSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addAdminGroupsApiCall,formData,isActive,0,false)
   yield put(addAdminGroups(response));
  } catch (error) {
    yield put(getAdminGroupsFail(error));
  }
}
function* updateAdminGroupsSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addAdminGroupsApiCall,formData,isActive,Id,false)
   yield put(updateAdminGroups(response));
  } catch (error) {
    yield put(getAdminGroupsFail(error));
  }
}
function* deleteAdminGroupsSaga(action) {
  try {
    const response = yield call(addAdminGroupsApiCall,'','',action.payload,true)
   yield put(deleteAdminGroups(response))
  } catch (error) {
    yield put(getAdminGroupsFail(error))
  }
}

function* adminGroupsAllSaga() {
  yield takeEvery(ADD_ADMINGROUPS_REQUEST, addAdminGroupsSaga)
  yield takeEvery(UPDATE_ADMINGROUPS_REQUEST, updateAdminGroupsSaga)
  yield takeEvery(DELETE_ADMINGROUPS_REQUEST, deleteAdminGroupsSaga)
  yield takeEvery(GET_ADMINGROUPS_REQUEST, adminGroupsSaga)
}

export {adminGroupsAllSaga} 