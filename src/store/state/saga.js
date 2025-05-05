import { takeEvery,call, put } from "redux-saga/effects";
import { getStatesSuccess, getStatesFail,addStates,updateStates,deleteStates } from "./actions";
import { ADD_STATES_REQUEST,GET_STATES_REQUEST,UPDATE_STATES_REQUEST,DELETE_STATES_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getStates,addStatesApiCall } from "helpers/Api/api_state";

function* statesSaga() {
  try {
    const response = yield call(getStates)
    yield put(getStatesSuccess(response))
  } catch (error) {
    yield put(getStatesFail(error));
  }
}

function* addStateSaga(action) {
  const {formData,selectCountry,isActive } = action.payload
  try {
    const response = yield call(addStatesApiCall,formData,selectCountry,isActive,0,false)
   yield put(addStates(response));
  } catch (error) {
    yield put(getStatesFail(error));
  }
}
function* updateStateSaga(action) {
  const {formData,selectCountry,isActive,Id } = action.payload
  try {
    const response = yield call(addStatesApiCall,formData,selectCountry,isActive,Id,false)
   yield put(updateStates(response));
  } catch (error) {
    yield put(getStatesFail(error));
  }
}
function* deleteStatesSaga(action) {
  try {
    const response = yield call(addStatesApiCall,'','','',action.payload,true)
   yield put(deleteStates(response))
  } catch (error) {
    yield put(getStatesFail(error))
  }
}

function* statesAllSaga() {
  yield takeEvery(ADD_STATES_REQUEST, addStateSaga)
  yield takeEvery(UPDATE_STATES_REQUEST, updateStateSaga)
  yield takeEvery(DELETE_STATES_REQUEST, deleteStatesSaga)
  yield takeEvery(GET_STATES_REQUEST, statesSaga)
}

export {statesAllSaga} 