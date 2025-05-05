import { takeEvery,call, put } from "redux-saga/effects";
import { getCustomerGroupsSuccess, getCustomerGroupsFail,addCustomerGroups,updateCustomerGroups,deleteCustomerGroups } from "./actions";
import { ADD_CUSTOMERGROUPS_REQUEST,GET_CUSTOMERGROUPS_REQUEST,UPDATE_CUSTOMERGROUPS_REQUEST,DELETE_CUSTOMERGROUPS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCustomerGroups,addCustomerGroupsApiCall } from "helpers/Api/api_customerGroups";

function*customergroupsSaga() {
  try {
    const response = yield call(getCustomerGroups)
    yield put(getCustomerGroupsSuccess(response))
  } catch (error) {
    yield put(getCustomerGroupsFail(error));
  }
}

function* addCustomerGroupsSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addCustomerGroupsApiCall,formData,isActive,0,false)
   yield put(addCustomerGroups(response));
  } catch (error) {
    yield put(getCustomerGroupsFail(error));
  }
}
function* updateCustomerGroupsSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addCustomerGroupsApiCall,formData,isActive,Id,false)
   yield put(updateCustomerGroups(response));
  } catch (error) {
    yield put(getCustomerGroupsFail(error));
  }
}
function* deleteCustomerGroupsSaga(action) {
  try {
    const response = yield call(addCustomerGroupsApiCall,'','',action.payload,true)
   yield put(deleteCustomerGroups(response))
  } catch (error) {
    yield put(getCustomerGroupsFail(error))
  }
}

function* customerGroupsAllSaga() {
  yield takeEvery(ADD_CUSTOMERGROUPS_REQUEST, addCustomerGroupsSaga)
  yield takeEvery(UPDATE_CUSTOMERGROUPS_REQUEST, updateCustomerGroupsSaga)
  yield takeEvery(DELETE_CUSTOMERGROUPS_REQUEST, deleteCustomerGroupsSaga)
  yield takeEvery(GET_CUSTOMERGROUPS_REQUEST,customergroupsSaga)
}

export {customerGroupsAllSaga} 