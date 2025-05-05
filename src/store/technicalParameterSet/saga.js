import { takeEvery,call, put } from "redux-saga/effects";
import { getTechSetSuccess, getTechSetFail,addTechSet,updateTechSet,deleteTechSet } from "./actions";
import { ADD_TECHSET_REQUEST,GET_TECHSET_REQUEST,UPDATE_TECHSET_REQUEST,DELETE_TECHSET_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getTechSet,addTechSetApiCall } from "helpers/Api/api_technicalParameterSet";

function* techSetSaga() {
  try {
    const response = yield call(getTechSet)
    yield put(getTechSetSuccess(response))
  } catch (error) {
    yield put(getTechSetFail(error));
  }
}

function* addTechSetSaga(action) {
  const {set_label,parameter_sets } = action.payload
  try {
    const response = yield call(addTechSetApiCall,set_label,parameter_sets,0,false)
   yield put(addTechSet(response));
  } catch (error) {
    yield put(getTechSetFail(error));
  }
}
function* updateTechSetSaga(action) {
  const {set_label,parameter_sets,Id } = action.payload
  try {
    const response = yield call(addTechSetApiCall,set_label,parameter_sets,Id,false)
   yield put(updateTechSet(response));
  } catch (error) {
    yield put(getTechSetFail(error));
  }
}
function* deleteTechSetSaga(action) {
  try {
    const response = yield call(addTechSetApiCall,'','',action.payload,true)
   yield put(deleteTechSet(response))
  } catch (error) {
    yield put(getTechSetFail(error))
  }
}

function* techSetAllSaga() {
  yield takeEvery(ADD_TECHSET_REQUEST, addTechSetSaga)
  yield takeEvery(UPDATE_TECHSET_REQUEST, updateTechSetSaga)
  yield takeEvery(DELETE_TECHSET_REQUEST, deleteTechSetSaga)
  yield takeEvery(GET_TECHSET_REQUEST, techSetSaga)
}

export {techSetAllSaga} 