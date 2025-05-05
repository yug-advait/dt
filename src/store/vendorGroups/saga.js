import { takeEvery,call, put } from "redux-saga/effects";
import { getVendorGroupsSuccess, getVendorGroupsFail,addVendorGroups,updateVendorGroups,deleteVendorGroups } from "./actions";
import { ADD_VENDORGROUPS_REQUEST,GET_VENDORGROUPS_REQUEST,UPDATE_VENDORGROUPS_REQUEST,DELETE_VENDORGROUPS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getVendorGroups,addVendorGroupsApiCall } from "helpers/Api/api_vendorGroups";

function* VendorGroupsSaga() {
  try {
    const response = yield call(getVendorGroups)
    yield put(getVendorGroupsSuccess(response))
  } catch (error) {
    yield put(getVendorGroupsFail(error));
  }
}

function* addVendorGroupsSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addVendorGroupsApiCall,formData,isActive,0,false)
   yield put(addVendorGroups(response));
  } catch (error) {
    yield put(getVendorGroupsFail(error));
  }
}
function* updateVendorGroupsSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addVendorGroupsApiCall,formData,isActive,Id,false)
   yield put(updateVendorGroups(response));
  } catch (error) {
    yield put(getVendorGroupsFail(error));
  }
}
function* deleteVendorGroupsSaga(action) {
  try {
    const response = yield call(addVendorGroupsApiCall,'','',action.payload,true)
   yield put(deleteVendorGroups(response))
  } catch (error) {
    yield put(getVendorGroupsFail(error))
  }
}

function* VendorGroupsAllSaga() {
  yield takeEvery(ADD_VENDORGROUPS_REQUEST, addVendorGroupsSaga)
  yield takeEvery(UPDATE_VENDORGROUPS_REQUEST, updateVendorGroupsSaga)
  yield takeEvery(DELETE_VENDORGROUPS_REQUEST, deleteVendorGroupsSaga)
  yield takeEvery(GET_VENDORGROUPS_REQUEST, VendorGroupsSaga)
}

export {VendorGroupsAllSaga} 