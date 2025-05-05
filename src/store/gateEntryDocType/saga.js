import { takeEvery,call, put } from "redux-saga/effects";
import { gateEntryDocTypeSuccess, getGateEntryDocTypeFail,addGateEntryDocType,updateGateEntryDocType,deleteGateEntryDocType } from "./actions";
import { ADD_GATEENTRYDOCTYPE_REQUEST,GET_GATEENTRYDOCTYPE_REQUEST,UPDATE_GATEENTRYDOCTYPE_REQUEST,DELETE_GATEENTRYDOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getGateEntryDocType,addGateEntryDocTypeApiCall } from "helpers/Api/api_gateEntryDocType";

function* gateEntryDocType() {
  try {
    const response = yield call(getGateEntryDocType)
    yield put(gateEntryDocTypeSuccess(response))
  } catch (error) {
    yield put(getGateEntryDocTypeFail(error));
  }
}

function* addGateEntryDocTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addGateEntryDocTypeApiCall,formData,isActive,0,false)
   yield put(addGateEntryDocType(response));
  } catch (error) {
    yield put(getGateEntryDocTypeFail(error));
  }
}
function* updateGateEntryDocTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addGateEntryDocTypeApiCall,formData,isActive,Id,false)
   yield put(updateGateEntryDocType(response));
  } catch (error) {
    yield put(getGateEntryDocTypeFail(error));
  }
}
function* deleteGateEntryDocTypeSaga(action) {
  try {
    const response = yield call(addGateEntryDocTypeApiCall,'','',action.payload,true)
   yield put(deleteGateEntryDocType(response))
  } catch (error) {
    yield put(getGateEntryDocTypeFail(error))
  }
}

function* gateEntryDocTypeAllSaga() {
  yield takeEvery(ADD_GATEENTRYDOCTYPE_REQUEST, addGateEntryDocTypeSaga)
  yield takeEvery(UPDATE_GATEENTRYDOCTYPE_REQUEST, updateGateEntryDocTypeSaga)
  yield takeEvery(DELETE_GATEENTRYDOCTYPE_REQUEST, deleteGateEntryDocTypeSaga)
  yield takeEvery(GET_GATEENTRYDOCTYPE_REQUEST, gateEntryDocType)
}

export {gateEntryDocTypeAllSaga} 