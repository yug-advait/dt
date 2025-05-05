import { takeEvery,call, put } from "redux-saga/effects";
import { getPoSuccess, getPoFail,addPo,updatePo,
  deletePo } from "./actions";
import { ADD_PO_REQUEST,GET_PO_REQUEST,UPDATE_PO_REQUEST,DELETE_PO_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPo,addPoApiCall } from "helpers/Api/api_po";

function* poSaga() {
  try {
    const response = yield call(getPo)
    yield put(getPoSuccess(response))
  } catch (error) {
    yield put(getPoFail(error));
  }
}

function* addPoSaga(action) {
  const {formData,prFilteredItems,prPo } = action.payload
  try {
    const response = yield call(addPoApiCall,formData,prFilteredItems,prPo,0,false)
   yield put(addPo(response));
  } catch (error) {
    yield put(getPoFail(error));
  }
}
function* updatePoSaga(action) {
  const {formData,prFilteredItems,prPo,Id } = action.payload
  try {
    const response = yield call(addPoApiCall,formData,prFilteredItems,prPo,Id,false)
   yield put(updatePo(response));
  } catch (error) {
    yield put(getPoFail(error));
  }
}
function* deletePoSaga(action) {
  try {
    const response = yield call(addPoApiCall,'','','',action.payload,true)
   yield put(deletePo(response))
  } catch (error) {
    yield put(getPoFail(error))
  }
}

function* poAllSaga() {
  yield takeEvery(ADD_PO_REQUEST, addPoSaga)
  yield takeEvery(UPDATE_PO_REQUEST, updatePoSaga)
  yield takeEvery(DELETE_PO_REQUEST, deletePoSaga)
  yield takeEvery(GET_PO_REQUEST, poSaga)
}

export {poAllSaga} 