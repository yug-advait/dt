import { takeEvery,call, put } from "redux-saga/effects";
import { getVendorDashboardSuccess, getVendorDashboardFail,addVendorDashboard,updateVendorDashboard,deleteVendorDashboard } from "./actions";
import { ADD_VENDORDASHBOARD_REQUEST,GET_VENDORDASHBOARD_REQUEST,UPDATE_VENDORDASHBOARD_REQUEST,DELETE_VENDORDASHBOARD_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getVendorDashboard,addVendorDashboardApiCall } from "helpers/Api/api_vendordashboard";

function* vendordashboardSaga(action) {
  const {type} = action.payload
  try {
    const response = yield call(getVendorDashboard,type)
    yield put(getVendorDashboardSuccess(response))
  } catch (error) {
    yield put(getVendorDashboardFail(error));
  }
}

function* addVendorDashboardSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addVendorDashboardApiCall,formData,isActive,0,false)
   yield put(addVendorDashboard(response));
  } catch (error) {
    yield put(getVendorDashboardFail(error));
  }
}
function* updateVendorDashboardSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addVendorDashboardApiCall,formData,isActive,Id,false)
   yield put(updateVendorDashboard(response));
  } catch (error) {
    yield put(getVendorDashboardFail(error));
  }
}
function* deleteVendorDashboardSaga(action) {
  try {
    const response = yield call(addVendorDashboardApiCall,'','',action.payload,true)
   yield put(deleteVendorDashboard(response))
  } catch (error) {
    yield put(getVendorDashboardFail(error))
  }
}

function* vendorDashboardAllSaga() {
  yield takeEvery(ADD_VENDORDASHBOARD_REQUEST, addVendorDashboardSaga)
  yield takeEvery(UPDATE_VENDORDASHBOARD_REQUEST, updateVendorDashboardSaga)
  yield takeEvery(DELETE_VENDORDASHBOARD_REQUEST, deleteVendorDashboardSaga)
  yield takeEvery(GET_VENDORDASHBOARD_REQUEST, vendordashboardSaga)
}

export {vendorDashboardAllSaga} 