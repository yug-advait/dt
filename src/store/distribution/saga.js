import { takeEvery,call, put } from "redux-saga/effects";
import { getDistributionSuccess, getDistributionFail,addDistribution,updateDistribution,deleteDistribution } from "./actions";
import { ADD_DISTRIBUTION_REQUEST,GET_DISTRIBUTION_REQUEST,UPDATE_DISTRIBUTION_REQUEST,DELETE_DISTRIBUTION_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getDistribution,addDistributionApiCall } from "helpers/Api/api_distribution";

function* distributionSaga() {
  try {
    const response = yield call(getDistribution)
    yield put(getDistributionSuccess(response))
  } catch (error) {
    yield put(getDistributionFail(error));
  }
}

function* addDistributionSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addDistributionApiCall,formData,isActive,0,false)
   yield put(addDistribution(response));
  } catch (error) {
    yield put(getDistributionFail(error));
  }
}
function* updateDistributionaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addDistributionApiCall,formData,isActive,Id,false)
   yield put(updateDistribution(response));
  } catch (error) {
    yield put(getDistributionFail(error));
  }
}
function* deleteDistributionSaga(action) {
  try {
    const response = yield call(addDistributionApiCall,'','',action.payload,true)
   yield put(deleteDistribution(response))
  } catch (error) {
    yield put(getDistributionFail(error))
  }
}

function* distributionAllSaga() {
  yield takeEvery(ADD_DISTRIBUTION_REQUEST, addDistributionSaga)
  yield takeEvery(UPDATE_DISTRIBUTION_REQUEST, updateDistributionaga)
  yield takeEvery(DELETE_DISTRIBUTION_REQUEST, deleteDistributionSaga)
  yield takeEvery(GET_DISTRIBUTION_REQUEST, distributionSaga)
}

export {distributionAllSaga} 