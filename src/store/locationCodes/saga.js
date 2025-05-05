import { takeEvery,call, put } from "redux-saga/effects";
import { getLocationCodesSuccess, getLocationCodesFail,addLocationCodes,updateLocationCodes,deleteLocationCodes } from "./actions";
import { ADD_LOCATIONCODES_REQUEST,GET_LOCATIONCODES_REQUEST,UPDATE_LOCATIONCODES_REQUEST,DELETE_LOCATIONCODES_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getLocationCodes,addLocationCodesApiCall } from "helpers/Api/api_locationCodes";

function* locationcodesSaga() {
  try {
    const response = yield call(getLocationCodes)
    yield put(getLocationCodesSuccess(response))
  } catch (error) {
    yield put(getLocationCodesFail(error));
  }
}

function* addLocationCodesSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addLocationCodesApiCall,formData,isActive,0,false)
   yield put(addLocationCodes(response));
  } catch (error) {
    yield put(getLocationCodesFail(error));
  }
}
function* updateLocationCodesSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addLocationCodesApiCall,formData,isActive,Id,false)
   yield put(updateLocationCodes(response));
  } catch (error) {
    yield put(getLocationCodesFail(error));
  }
}
function* deleteLocationCodesSaga(action) {
  try {
    const response = yield call(addLocationCodesApiCall,'','',action.payload,true)
   yield put(deleteLocationCodes(response))
  } catch (error) {
    yield put(getLocationCodesFail(error))
  }
}

function* locationcodesAllSaga() {
  yield takeEvery(ADD_LOCATIONCODES_REQUEST, addLocationCodesSaga)
  yield takeEvery(UPDATE_LOCATIONCODES_REQUEST, updateLocationCodesSaga)
  yield takeEvery(DELETE_LOCATIONCODES_REQUEST, deleteLocationCodesSaga)
  yield takeEvery(GET_LOCATIONCODES_REQUEST, locationcodesSaga)
}

export {locationcodesAllSaga} 