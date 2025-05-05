import { takeEvery,call, put } from "redux-saga/effects";
import { updateStatus } from "./actions";
import { STATUS_REQUEST } from "./actionTypes";

import {updateStatusApiCall } from "helpers/Api/api_common";

function* updateStatusSaga(action) {
  try {
    const response = yield call(updateStatusApiCall, action.payload)
   yield put(updateStatus(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }
}

function* commonAllSaga() {
  yield takeEvery(STATUS_REQUEST, updateStatusSaga)
}

export {commonAllSaga} 