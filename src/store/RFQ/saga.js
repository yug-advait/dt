import { takeEvery,call, put } from "redux-saga/effects";
import { getRfqSuccess, getRfqFail,addRfq,updateRfq,
  deleteRfq } from "./actions";
import { ADD_RFQ_REQUEST,GET_RFQ_REQUEST,UPDATE_RFQ_REQUEST,DELETE_RFQ_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getRfq,addRfqApiCall } from "helpers/Api/api_rfq";

function* rfqSaga() {
  try {
    const response = yield call(getRfq)
    yield put(getRfqSuccess(response))
  } catch (error) {
    yield put(getRfqFail(error));
  }
}

function* addRfqSaga(action) {
  const {formData,prFilteredItems } = action.payload
  try {
    const response = yield call(addRfqApiCall,formData,prFilteredItems,0,false)
   yield put(addRfq(response));
  } catch (error) {
    yield put(getRfqFail(error));
  }
}
function* updateRfqSaga(action) {
  const {formData,prFilteredItems,Id } = action.payload
  try {
    const response = yield call(addRfqApiCall,formData,prFilteredItems,Id,false)
   yield put(updateRfq(response));
  } catch (error) {
    yield put(getRfqFail(error));
  }
}
function* deleteRfqSaga(action) {
  try {
    const response = yield call(addRfqApiCall,'','',action.payload,true)
   yield put(deleteRfq(response))
  } catch (error) {
    yield put(getRfqFail(error))
  }
}

function* rfqAllSaga() {
  yield takeEvery(ADD_RFQ_REQUEST, addRfqSaga)
  yield takeEvery(UPDATE_RFQ_REQUEST, updateRfqSaga)
  yield takeEvery(DELETE_RFQ_REQUEST, deleteRfqSaga)
  yield takeEvery(GET_RFQ_REQUEST, rfqSaga)
}

export {rfqAllSaga} 