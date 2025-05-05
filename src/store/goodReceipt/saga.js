import { takeEvery,call, put } from "redux-saga/effects";
import { getGoodReceiptSuccess, getGoodReceiptFail,addGoodReceipt,updateGoodReceipt,
  deleteGoodReceipt } from "./actions";
import { ADD_GOODRECEIPT_REQUEST,GET_GOODRECEIPT_REQUEST,UPDATE_GOODRECEIPT_REQUEST,DELETE_GOODRECEIPT_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getGoodReceipt,addGoodReceiptApiCall } from "helpers/Api/api_goodReceipt";

function* goodReceipt() {
  try {
    const response = yield call(getGoodReceipt)
    yield put(getGoodReceiptSuccess(response))
  } catch (error) {
    yield put(getGoodReceiptFail(error));
  }
}

function* addGoodReceiptSaga(action) {
  const {formData,asnFilteredItems } = action.payload
  try {
    const response = yield call(addGoodReceiptApiCall,formData,asnFilteredItems,0,false)
   yield put(addGoodReceipt(response));
  } catch (error) {
    yield put(getGoodReceiptFail(error));
  }
}
function* updateGoodReceiptSaga(action) {
  const {formData,asnFilteredItems,Id } = action.payload
  try {
    const response = yield call(addGoodReceiptApiCall,formData,asnFilteredItems,Id,false)
   yield put(updateGoodReceipt(response));
  } catch (error) {
    yield put(getGoodReceiptFail(error));
  }
}
function* deleteGoodReceiptSaga(action) {
  try {
    const response = yield call(addGoodReceiptApiCall,'','',action.payload,true)
   yield put(deleteGoodReceipt(response))
  } catch (error) {
    yield put(getGoodReceiptFail(error))
  }
}

function* goodReceiptAllSaga() {
  yield takeEvery(ADD_GOODRECEIPT_REQUEST, addGoodReceiptSaga)
  yield takeEvery(UPDATE_GOODRECEIPT_REQUEST, updateGoodReceiptSaga)
  yield takeEvery(DELETE_GOODRECEIPT_REQUEST, deleteGoodReceiptSaga)
  yield takeEvery(GET_GOODRECEIPT_REQUEST, goodReceipt)
}

export {goodReceiptAllSaga} 