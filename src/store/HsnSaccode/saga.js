import { takeEvery,call, put } from "redux-saga/effects";
import { getHsnSacSuccess, getHsnSacFail,addHsnSac,updateHsnSac,
  deleteHsnSac } from "./actions";
import { ADD_HSNSAC_REQUEST,GET_HSNSAC_REQUEST,UPDATE_HSNSAC_REQUEST,DELETE_HSNSAC_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getHsnSac,addHsnSacApiCall } from "helpers/Api/api_hsnsac";

function* HsnSacSaga(action) {
  const {hsn_sac_type } = action.payload
  try {
    const response = yield call(getHsnSac, hsn_sac_type)
    yield put(getHsnSacSuccess(response))
  } catch (error) {
    yield put(getHsnSacFail(error));
  }
}

function* addHsnSacSaga(action) {
  const {formData,isActive,hsn_sac_type } = action.payload
  try {
    const response = yield call(addHsnSacApiCall,formData,isActive,0,false,hsn_sac_type)
   yield put(addHsnSac(response));
  } catch (error) {
    yield put(getHsnSacFail(error));
  }
}
function* updateHsnSacSaga(action) {
  const {formData,isActive,hsn_sac_type,Id } = action.payload
  try {
    const response = yield call(addHsnSacApiCall,formData,isActive,Id,false,hsn_sac_type)
   yield put(updateHsnSac(response));
  } catch (error) {
    yield put(getHsnSacFail(error));
  }
}
function* deleteHsnSacSaga(action) {
  try {
    const response = yield call(addHsnSacApiCall,'','',action.payload,true,'')
   yield put(deleteHsnSac(response))
  } catch (error) {
    yield put(getHsnSacFail(error))
  }
}

function* hsnsacAllSaga() {
  yield takeEvery(ADD_HSNSAC_REQUEST, addHsnSacSaga)
  yield takeEvery(UPDATE_HSNSAC_REQUEST, updateHsnSacSaga)
  yield takeEvery(DELETE_HSNSAC_REQUEST, deleteHsnSacSaga)
  yield takeEvery(GET_HSNSAC_REQUEST, HsnSacSaga)
}

export {hsnsacAllSaga} 