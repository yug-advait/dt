import { takeEvery,call, put } from "redux-saga/effects";
import { getGLAccountSuccess, getGLAccountFail,addGLAccount,updateGLAccount,
  deleteGLAccount } from "./actions";
import { ADD_GLACCOUNT_REQUEST,GET_GLACCOUNT_REQUEST,UPDATE_GLACCOUNT_REQUEST,DELETE_GLACCOUNT_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getGLAccount,addGLAccountApiCall } from "helpers/Api/api_glAccount";

function* glAccountSaga() {
  try {
    const response = yield call(getGLAccount)
    yield put(getGLAccountSuccess(response))
  } catch (error) {
    yield put(getGLAccountFail(error));
  }
}

function* addGLAccountSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addGLAccountApiCall,formData,isActive,0,false)
   yield put(addGLAccount(response));
  } catch (error) {
    yield put(getGLAccountFail(error));
  }
}
function* updateGLAccountSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addGLAccountApiCall,formData,isActive,Id,false)
   yield put(updateGLAccount(response));
  } catch (error) {
    yield put(getGLAccountFail(error));
  }
}
function* deleteGLAccountSaga(action) {
  try {
    const response = yield call(addGLAccountApiCall,'','',action.payload,true)
   yield put(deleteGLAccount(response))
  } catch (error) {
    yield put(getGLAccountFail(error))
  }
}

function* glAccountAllSaga() {
  yield takeEvery(ADD_GLACCOUNT_REQUEST, addGLAccountSaga)
  yield takeEvery(UPDATE_GLACCOUNT_REQUEST, updateGLAccountSaga)
  yield takeEvery(DELETE_GLACCOUNT_REQUEST, deleteGLAccountSaga)
  yield takeEvery(GET_GLACCOUNT_REQUEST, glAccountSaga)
}

export {glAccountAllSaga} 