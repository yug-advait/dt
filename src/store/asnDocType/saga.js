import { takeEvery,call, put } from "redux-saga/effects";
import { getAsnDocTypeSuccess, getAsnDocTypeFail,addAsnDocType,updateAsnDocType,deleteAsnDocType } from "./actions";
import { ADD_ASNDOCTYPE_REQUEST,GET_ASNDOCTYPE_REQUEST,UPDATE_ASNDOCTYPE_REQUEST,DELETE_ASNDOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getAsnDocType,addAsnDocTypeApiCall } from "helpers/Api/api_asnDocType";

function* asnDocTypeSaga() {
  try {
    const response = yield call(getAsnDocType)
    yield put(getAsnDocTypeSuccess(response))
  } catch (error) {
    yield put(getAsnDocTypeFail(error));
  }
}

function* addAsnDocTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addAsnDocTypeApiCall,formData,isActive,0,false)
   yield put(addAsnDocType(response));
  } catch (error) {
    yield put(getAsnDocTypeFail(error));
  }
}
function* updateAsnDocTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addAsnDocTypeApiCall,formData,isActive,Id,false)
   yield put(updateAsnDocType(response));
  } catch (error) {
    yield put(getAsnDocTypeFail(error));
  }
}
function* deleteAsnDocTypeSaga(action) {
  try {
    const response = yield call(addAsnDocTypeApiCall,'','',action.payload,true)
   yield put(deleteAsnDocType(response))
  } catch (error) {
    yield put(getAsnDocTypeFail(error))
  }
}

function* asnDocTypeAllSaga() {
  yield takeEvery(ADD_ASNDOCTYPE_REQUEST, addAsnDocTypeSaga)
  yield takeEvery(UPDATE_ASNDOCTYPE_REQUEST, updateAsnDocTypeSaga)
  yield takeEvery(DELETE_ASNDOCTYPE_REQUEST, deleteAsnDocTypeSaga)
  yield takeEvery(GET_ASNDOCTYPE_REQUEST, asnDocTypeSaga)
}

export {asnDocTypeAllSaga} 