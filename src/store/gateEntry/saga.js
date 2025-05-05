import { takeEvery,call, put } from "redux-saga/effects";
import { getGateEntrySuccess, getGateEntryFail,addGateEntry,updateGateEntry,
  deleteGateEntry } from "./actions";
import { ADD_GATEENTRY_REQUEST,GET_GATEENTRY_REQUEST,UPDATE_GATEENTRY_REQUEST,DELETE_GATEENTRY_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getGateEntry,addGateEntryApiCall } from "helpers/Api/api_gateEntry";

function* gateEntry() {
  try {
    const response = yield call(getGateEntry)
    yield put(getGateEntrySuccess(response))
  } catch (error) {
    yield put(getGateEntryFail(error));
  }
}

function* addGateEntrySaga(action) {
  const {formData,GateInbound,grnFilteredItems } = action.payload
  try {
    const response = yield call(addGateEntryApiCall,formData,GateInbound,grnFilteredItems,0,false)
   yield put(addGateEntry(response));
  } catch (error) {
    yield put(getGateEntryFail(error));
  }
}
function* updateGateEntrySaga(action) {
  const {formData,GateInbound,grnFilteredItems,Id } = action.payload
  try {
    const response = yield call(addGateEntryApiCall,formData,GateInbound,grnFilteredItems,Id,false)
   yield put(updateGateEntry(response));
  } catch (error) {
    yield put(getGateEntryFail(error));
  }
}
function* deleteGateEntrySaga(action) {
  try {
    const response = yield call(addGateEntryApiCall,'','','',action.payload,true)
   yield put(deleteGateEntry(response))
  } catch (error) {
    yield put(getGateEntryFail(error))
  }
}

function* gateEntryAllSaga() {
  yield takeEvery(ADD_GATEENTRY_REQUEST, addGateEntrySaga)
  yield takeEvery(UPDATE_GATEENTRY_REQUEST, updateGateEntrySaga)
  yield takeEvery(DELETE_GATEENTRY_REQUEST, deleteGateEntrySaga)
  yield takeEvery(GET_GATEENTRY_REQUEST, gateEntry)
}

export {gateEntryAllSaga} 