import { takeEvery,call, put } from "redux-saga/effects";
import { getPrItemSuccess, getPrItemFail,addPrItem,updatePrItem,deletePrItem } from "./actions";
import { ADD_PRITEM_REQUEST,GET_PRITEM_REQUEST,UPDATE_PRITEM_REQUEST,DELETE_PRITEM_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPrItem,addPrItemApiCall } from "helpers/Api/api_prItem";

function* prItemSaga() {
  try {
    const response = yield call(getPrItem)
    yield put(getPrItemSuccess(response))
  } catch (error) {
    yield put(getPrItemFail(error));
  }
}

function* addPrItemSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addPrItemApiCall,formData,isActive,0,false)
   yield put(addPrItem(response));
  } catch (error) {
    yield put(getPrItemFail(error));
  }
}
function* updatePrItemSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addPrItemApiCall,formData,isActive,Id,false)
   yield put(updatePrItem(response));
  } catch (error) {
    yield put(getPrItemFail(error));
  }
}
function* deletePrItemSaga(action) {
  try {
    const response = yield call(addPrItemApiCall,'','',action.payload,true)
   yield put(deletePrItem(response))
  } catch (error) {
    yield put(getPrItemFail(error))
  }
}

function* prItemAllSaga() {
  yield takeEvery(ADD_PRITEM_REQUEST, addPrItemSaga)
  yield takeEvery(UPDATE_PRITEM_REQUEST, updatePrItemSaga)
  yield takeEvery(DELETE_PRITEM_REQUEST, deletePrItemSaga)
  yield takeEvery(GET_PRITEM_REQUEST, prItemSaga)
}

export {prItemAllSaga} 