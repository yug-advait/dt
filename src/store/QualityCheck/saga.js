import { takeEvery,call, put } from "redux-saga/effects";
import { getQualityCheckSuccess, getQualityCheckFail,addQualityCheck,updateQualityCheck,
  deleteQualityCheck } from "./actions";
import { ADD_QUALITYCHECK_REQUEST,GET_QUALITYCHECK_REQUEST,UPDATE_QUALITYCHECK_REQUEST,DELETE_QUALITYCHECK_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getQualityCheck,addQualityCheckApiCall } from "helpers/Api/api_qualityCheck";

function* qualityCheck() {
  try {
    const response = yield call(getQualityCheck)
    yield put(getQualityCheckSuccess(response))
  } catch (error) {
    yield put(getQualityCheckFail(error));
  }
}

function* addQualityCheckSaga(action) {
  const {formData,poFilteredItems } = action.payload
  try {
    const response = yield call(addQualityCheckApiCall,formData,poFilteredItems,0,false)
   yield put(addQualityCheck(response));
  } catch (error) {
    yield put(getQualityCheckFail(error));
  }
}
function* updateQualityCheckSaga(action) {
  const {formData,poFilteredItems,Id } = action.payload
  try {
    const response = yield call(addQualityCheckApiCall,formData,poFilteredItems,Id,false)
   yield put(updateQualityCheck(response));
  } catch (error) {
    yield put(getQualityCheckFail(error));
  }
}
function* deleteQualityCheckSaga(action) {
  try {
    const response = yield call(addQualityCheckApiCall,'','',action.payload,true)
   yield put(deleteQualityCheck(response))
  } catch (error) {
    yield put(getQualityCheckFail(error))
  }
}

function* qualityCheckAllSaga() {
  yield takeEvery(ADD_QUALITYCHECK_REQUEST, addQualityCheckSaga)
  yield takeEvery(UPDATE_QUALITYCHECK_REQUEST, updateQualityCheckSaga)
  yield takeEvery(DELETE_QUALITYCHECK_REQUEST, deleteQualityCheckSaga)
  yield takeEvery(GET_QUALITYCHECK_REQUEST, qualityCheck)
}

export {qualityCheckAllSaga} 