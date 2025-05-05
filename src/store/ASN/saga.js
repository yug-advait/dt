import { takeEvery,call, put } from "redux-saga/effects";
import { getAsnSuccess, getAsnFail,addAsn,updateAsn,
  deleteAsn } from "./actions";
import { ADD_ASN_REQUEST,GET_ASN_REQUEST,UPDATE_ASN_REQUEST,DELETE_ASN_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getAsn,addAsnApiCall } from "helpers/Api/api_asn";

function* asnSaga() {
  try {
    const response = yield call(getAsn)
    yield put(getAsnSuccess(response))
  } catch (error) {
    yield put(getAsnFail(error));
  }
}

function* addAsnSaga(action) {
  const {formData,poFilteredItems } = action.payload
  try {
    const response = yield call(addAsnApiCall,formData,poFilteredItems,0,false)
   yield put(addAsn(response));
  } catch (error) {
    yield put(getAsnFail(error));
  }
}
function* updateAsnSaga(action) {
  const {formData,poFilteredItems,Id } = action.payload
  try {
    const response = yield call(addAsnApiCall,formData,poFilteredItems,Id,false)
   yield put(updateAsn(response));
  } catch (error) {
    yield put(getAsnFail(error));
  }
}
function* deleteAsnSaga(action) {
  try {
    const response = yield call(addAsnApiCall,'','',action.payload,true)
   yield put(deleteAsn(response))
  } catch (error) {
    yield put(getAsnFail(error))
  }
}

function* asnAllSaga() {
  yield takeEvery(ADD_ASN_REQUEST, addAsnSaga)
  yield takeEvery(UPDATE_ASN_REQUEST, updateAsnSaga)
  yield takeEvery(DELETE_ASN_REQUEST, deleteAsnSaga)
  yield takeEvery(GET_ASN_REQUEST, asnSaga)
}

export {asnAllSaga} 