import { takeEvery,call, put } from "redux-saga/effects";
import { getRfqDocTypeSuccess, getRfqDocTypeFail,addRfqDocType,updateRfqDocType,deleteRfqDocType } from "./actions";
import { ADD_RFQDOCTYPE_REQUEST,GET_RFQDOCTYPE_REQUEST,UPDATE_RFQDOCTYPE_REQUEST,DELETE_RFQDOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getRfqDocType,addRfqDocTypeApiCall } from "helpers/Api/api_rfqDocType";

function* rfqDocTypeSaga() {
  try {
    const response = yield call(getRfqDocType)
    yield put(getRfqDocTypeSuccess(response))
  } catch (error) {
    yield put(getRfqDocTypeFail(error));
  }
}

function* addRfqDocTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addRfqDocTypeApiCall,formData,isActive,0,false)
   yield put(addRfqDocType(response));
  } catch (error) {
    yield put(getRfqDocTypeFail(error));
  }
}
function* updateRfqDocTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addRfqDocTypeApiCall,formData,isActive,Id,false)
   yield put(updateRfqDocType(response));
  } catch (error) {
    yield put(getRfqDocTypeFail(error));
  }
}
function* deleteRfqDocTypeSaga(action) {
  try {
    const response = yield call(addRfqDocTypeApiCall,'','',action.payload,true)
   yield put(deleteRfqDocType(response))
  } catch (error) {
    yield put(getRfqDocTypeFail(error))
  }
}

function* rfqDocTypeAllSaga() {
  yield takeEvery(ADD_RFQDOCTYPE_REQUEST, addRfqDocTypeSaga)
  yield takeEvery(UPDATE_RFQDOCTYPE_REQUEST, updateRfqDocTypeSaga)
  yield takeEvery(DELETE_RFQDOCTYPE_REQUEST, deleteRfqDocTypeSaga)
  yield takeEvery(GET_RFQDOCTYPE_REQUEST, rfqDocTypeSaga)
}

export {rfqDocTypeAllSaga} 