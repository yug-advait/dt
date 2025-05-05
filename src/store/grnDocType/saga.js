import { takeEvery,call, put } from "redux-saga/effects";
import { getGrnDocTypeSuccess, getGrnDocTypeFail,addGrnDocType,updateGrnDocType,deleteGrnDocType } from "./actions";
import { ADD_GRNDOCTYPE_REQUEST,GET_GRNDOCTYPE_REQUEST,UPDATE_GRNDOCTYPE_REQUEST,DELETE_GRNDOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getGrnDocType,addGrnDocTypeApiCall } from "helpers/Api/api_grnDocType";

function* grnDocTypeSaga() {
  try {
    const response = yield call(getGrnDocType)
    yield put(getGrnDocTypeSuccess(response))
  } catch (error) {
    yield put(getGrnDocTypeFail(error));
  }
}

function* addGrnDocTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addGrnDocTypeApiCall,formData,isActive,0,false)
   yield put(addGrnDocType(response));
  } catch (error) {
    yield put(getGrnDocTypeFail(error));
  }
}
function* updateGrnDocTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addGrnDocTypeApiCall,formData,isActive,Id,false)
   yield put(updateGrnDocType(response));
  } catch (error) {
    yield put(getGrnDocTypeFail(error));
  }
}
function* deleteGrnDocTypeSaga(action) {
  try {
    const response = yield call(addGrnDocTypeApiCall,'','',action.payload,true)
   yield put(deleteGrnDocType(response))
  } catch (error) {
    yield put(getGrnDocTypeFail(error))
  }
}

function* grnDocTypeAllSaga() {
  yield takeEvery(ADD_GRNDOCTYPE_REQUEST, addGrnDocTypeSaga)
  yield takeEvery(UPDATE_GRNDOCTYPE_REQUEST, updateGrnDocTypeSaga)
  yield takeEvery(DELETE_GRNDOCTYPE_REQUEST, deleteGrnDocTypeSaga)
  yield takeEvery(GET_GRNDOCTYPE_REQUEST, grnDocTypeSaga)
}

export {grnDocTypeAllSaga} 