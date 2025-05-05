import { takeEvery,call, put } from "redux-saga/effects";
import { getAdminsSuccess, getAdminsFail,addAdmins,updateAdmins,
  deleteAdmins } from "./actions";
import { ADD_ADMINS_REQUEST,GET_ADMINS_REQUEST,UPDATE_ADMINS_REQUEST,DELETE_ADMINS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getAdmins,addAdminsApiCall } from "helpers/Api/api_admins";

function* adminsSaga() {
  try {
    const response = yield call(getAdmins)
    yield put(getAdminsSuccess(response))
  } catch (error) {
    yield put(getAdminsFail(error));
  }
}

function* addAdminsSaga(action) {
  const {formData,canApprove,approvalManager,maxPriceBand,menuList } = action.payload
  try {
    const response = yield call(addAdminsApiCall,formData,canApprove,approvalManager,maxPriceBand,menuList,true,0,false)
   yield put(addAdmins(response));
  } catch (error) {
    yield put(getAdminsFail(error));
  }
}
function* updateAdminsSaga(action) {
  const {formData,canApprove,approvalManager,maxPriceBand,menuList,Id } = action.payload
  try {
    const response = yield call(addAdminsApiCall,formData,canApprove,approvalManager,maxPriceBand,menuList,true,Id,false)
   yield put(updateAdmins(response));
  } catch (error) {
    yield put(getAdminsFail(error));
  }
}
function* deleteAdminsSaga(action) {
  try {
    const response = yield call(addAdminsApiCall,'','','','','','',action.payload,true)
   yield put(deleteAdmins(response))
  } catch (error) {
    yield put(getAdminsFail(error))
  }
}

function* adminsAllSaga() {
  yield takeEvery(ADD_ADMINS_REQUEST, addAdminsSaga)
  yield takeEvery(UPDATE_ADMINS_REQUEST, updateAdminsSaga)
  yield takeEvery(DELETE_ADMINS_REQUEST, deleteAdminsSaga)
  yield takeEvery(GET_ADMINS_REQUEST, adminsSaga)
}

export {adminsAllSaga} 