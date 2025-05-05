import { takeEvery,call, put } from "redux-saga/effects";
import { getPrSuccess, getPrFail,addPr,updatePr,
  deletePr } from "./actions";
import { ADD_PR_REQUEST,GET_PR_REQUEST,UPDATE_PR_REQUEST,DELETE_PR_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPr,addPrApiCall } from "helpers/Api/api_pr";

function* prSaga() {
  try {
    const response = yield call(getPr)
    yield put(getPrSuccess(response))
  } catch (error) {
    yield put(getPrFail(error));
  }
}

function* addPrSaga(action) {
  const {formData,lineItems } = action.payload
  try {
    const response = yield call(addPrApiCall,formData,lineItems,0,false)
   yield put(addPr(response));
  } catch (error) {
    yield put(getPrFail(error));
  }
}
function* updatePrSaga(action) {
  const {formData,Id } = action.payload
  try {
    const response = yield call(addPrApiCall,formData,lineItems,Id,false)
   yield put(updatePr(response));
  } catch (error) {
    yield put(getPrFail(error));
  }
}
function* deletePrSaga(action) {
  try {
    const response = yield call(addPrApiCall,'','',action.payload,true)
   yield put(deletePr(response))
  } catch (error) {
    yield put(getPrFail(error))
  }
}

function* prAllSaga() {
  yield takeEvery(ADD_PR_REQUEST, addPrSaga)
  yield takeEvery(UPDATE_PR_REQUEST, updatePrSaga)
  yield takeEvery(DELETE_PR_REQUEST, deletePrSaga)
  yield takeEvery(GET_PR_REQUEST, prSaga)
}

export {prAllSaga} 