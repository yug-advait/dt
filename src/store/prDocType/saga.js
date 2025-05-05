import { takeEvery,call, put } from "redux-saga/effects";
import { getPrDocTypeSuccess, getPrDocTypeFail,addPrDocType,updatePrDocType,deletePrDocType } from "./actions";
import { ADD_PRDOCTYPE_REQUEST,GET_PRDOCTYPE_REQUEST,UPDATE_PRDOCTYPE_REQUEST,DELETE_PRDOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPrDocType,addPrDocTypeApiCall } from "helpers/Api/api_prDocType";

function* prDocTypeSaga() {
  try {
    const response = yield call(getPrDocType)
    yield put(getPrDocTypeSuccess(response))
  } catch (error) {
    yield put(getPrDocTypeFail(error));
  }
}

function* addPrDocTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addPrDocTypeApiCall,formData,isActive,0,false)
   yield put(addPrDocType(response));
  } catch (error) {
    yield put(getPrDocTypeFail(error));
  }
}
function* updatePrDocTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addPrDocTypeApiCall,formData,isActive,Id,false)
   yield put(updatePrDocType(response));
  } catch (error) {
    yield put(getPrDocTypeFail(error));
  }
}
function* deletePrDocTypeSaga(action) {
  try {
    const response = yield call(addPrDocTypeApiCall,'','',action.payload,true)
   yield put(deletePrDocType(response))
  } catch (error) {
    yield put(getPrDocTypeFail(error))
  }
}

function* prDocTypeAllSaga() {
  yield takeEvery(ADD_PRDOCTYPE_REQUEST, addPrDocTypeSaga)
  yield takeEvery(UPDATE_PRDOCTYPE_REQUEST, updatePrDocTypeSaga)
  yield takeEvery(DELETE_PRDOCTYPE_REQUEST, deletePrDocTypeSaga)
  yield takeEvery(GET_PRDOCTYPE_REQUEST, prDocTypeSaga)
}

export {prDocTypeAllSaga} 