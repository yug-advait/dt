import { takeEvery,call, put } from "redux-saga/effects";
import { getPoDocTypeSuccess, getPoDocTypeFail,addPoDocType,updatePoDocType,deletePoDocType } from "./actions";
import { ADD_PODOCTYPE_REQUEST,GET_PODOCTYPE_REQUEST,UPDATE_PODOCTYPE_REQUEST,DELETE_PODOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getPoDocType,addPoDocTypeApiCall } from "helpers/Api/api_poDocType";

function* poDocTypeSaga() {
  try {
    const response = yield call(getPoDocType)
    yield put(getPoDocTypeSuccess(response))
  } catch (error) {
    yield put(getPoDocTypeFail(error));
  }
}

function* addPoDocTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addPoDocTypeApiCall,formData,isActive,0,false)
   yield put(addPoDocType(response));
  } catch (error) {
    yield put(getPoDocTypeFail(error));
  }
}
function* updatePoDocTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addPoDocTypeApiCall,formData,isActive,Id,false)
   yield put(updatePoDocType(response));
  } catch (error) {
    yield put(getPoDocTypeFail(error));
  }
}
function* deletePoDocTypeSaga(action) {
  try {
    const response = yield call(addPoDocTypeApiCall,'','',action.payload,true)
   yield put(deletePoDocType(response))
  } catch (error) {
    yield put(getPoDocTypeFail(error))
  }
}

function* poDocTypeAllSaga() {
  yield takeEvery(ADD_PODOCTYPE_REQUEST, addPoDocTypeSaga)
  yield takeEvery(UPDATE_PODOCTYPE_REQUEST, updatePoDocTypeSaga)
  yield takeEvery(DELETE_PODOCTYPE_REQUEST, deletePoDocTypeSaga)
  yield takeEvery(GET_PODOCTYPE_REQUEST, poDocTypeSaga)
}

export {poDocTypeAllSaga} 