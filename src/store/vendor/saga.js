import { takeEvery,call, put } from "redux-saga/effects";
import { getVendorSuccess, getVendorFail,addVendor,updateVendor,deleteVendor } from "./actions";
import { ADD_VENDOR_REQUEST,GET_VENDOR_REQUEST,UPDATE_VENDOR_REQUEST,DELETE_VENDOR_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getVendor,addVendorApiCall } from "helpers/Api/api_vendor";

function* VendorSaga() {
  try {
    const response = yield call(getVendor)
    yield put(getVendorSuccess(response))
  } catch (error) {
    yield put(getVendorFail(error));
  }
}

function* addVendorSaga(action) {
  const {formData } = action.payload
  try {
    const response = yield call(addVendorApiCall,formData,true,0,false)
   yield put(addVendor(response));
  } catch (error) {
    yield put(getVendorFail(error));
  }
}
function* updateVendorSaga(action) {
  const {formData,Id } = action.payload
  try {
    const response = yield call(addVendorApiCall,formData,true,Id,false)
   yield put(updateVendor(response));
  } catch (error) {
    yield put(getVendorFail(error));
  }
}
function* deleteVendorSaga(action) {
  try {
    const response = yield call(addVendorApiCall,'','',action.payload,true)
   yield put(deleteVendor(response))
  } catch (error) {
    yield put(getVendorFail(error))
  }
}

function* VendorAllSaga() {
  yield takeEvery(ADD_VENDOR_REQUEST, addVendorSaga)
  yield takeEvery(UPDATE_VENDOR_REQUEST, updateVendorSaga)
  yield takeEvery(DELETE_VENDOR_REQUEST, deleteVendorSaga)
  yield takeEvery(GET_VENDOR_REQUEST, VendorSaga)
}

export {VendorAllSaga} 