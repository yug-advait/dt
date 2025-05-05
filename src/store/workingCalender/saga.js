import { takeEvery,call, put } from "redux-saga/effects";
import { getWorkingCalenderSuccess, getWorkingCalenderFail,addWorkingCalender,updateWorkingCalender,deleteWorkingCalender } from "./actions";
import { ADD_WORKINGCALENDER_REQUEST,GET_WORKINGCALENDER_REQUEST,UPDATE_WORKINGCALENDER_REQUEST,DELETE_WORKINGCALENDER_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getWorkingCalender,addWorkingCalenderApiCall } from "helpers/Api/api_workingCalender";

function* workingCalenderSaga() {
  try {
    const response = yield call(getWorkingCalender)
    yield put(getWorkingCalenderSuccess(response))
  } catch (error) {
    yield put(getWorkingCalenderFail(error));
  }
}

function* addWorkingCalenderSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addWorkingCalenderApiCall,formData,isActive,0,false)
   yield put(addWorkingCalender(response));
  } catch (error) {
    yield put(getWorkingCalenderFail(error));
  }
}
function* updateWorkingCalenderSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addWorkingCalenderApiCall,formData,isActive,Id,false)
   yield put(updateWorkingCalender(response));
  } catch (error) {
    yield put(getWorkingCalenderFail(error));
  }
}
function* deleteWorkingCalenderSaga(action) {
  try {
    const response = yield call(addWorkingCalenderApiCall,'','',action.payload,true)
   yield put(deleteWorkingCalender(response))
  } catch (error) {
    yield put(getWorkingCalenderFail(error))
  }
}

function* workingCalenderAllSaga() {
  yield takeEvery(ADD_WORKINGCALENDER_REQUEST, addWorkingCalenderSaga)
  yield takeEvery(UPDATE_WORKINGCALENDER_REQUEST, updateWorkingCalenderSaga)
  yield takeEvery(DELETE_WORKINGCALENDER_REQUEST, deleteWorkingCalenderSaga)
  yield takeEvery(GET_WORKINGCALENDER_REQUEST, workingCalenderSaga)
}

export {workingCalenderAllSaga} 