import { takeEvery,call, put } from "redux-saga/effects";
import { getAccountGroupsSuccess, getAccountGroupsFail,addAccountGroups,updateAccountGroups,deleteAccountGroups } from "./actions";
import { ADD_ACCOUNTGROUPS_REQUEST,GET_ACCOUNTGROUPS_REQUEST,UPDATE_ACCOUNTGROUPS_REQUEST,DELETE_ACCOUNTGROUPS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getAccountGroups,addAccountGroupsApiCall } from "helpers/Api/api_accountGroups";

function* accountgroupsSaga(action) {
  const {account_group_type } = action.payload
  try {
    const response = yield call(getAccountGroups,account_group_type)
    yield put(getAccountGroupsSuccess(response))
  } catch (error) {
    yield put(getAccountGroupsFail(error));
  }
}

function* addAccountGroupsSaga(action) {
  const {formData,account_group_type,isActive } = action.payload
  try {
    const response = yield call(addAccountGroupsApiCall,formData,isActive,0,false,account_group_type)
   yield put(addAccountGroups(response));
  } catch (error) {
    yield put(getAccountGroupsFail(error));
  }
}
function* updateAccountGroupsSaga(action) {
  const {formData,account_group_type,isActive,Id } = action.payload
  try {
    const response = yield call(addAccountGroupsApiCall,formData,isActive,Id,false,account_group_type)
   yield put(updateAccountGroups(response));
  } catch (error) {
    yield put(getAccountGroupsFail(error));
  }
}
function* deleteAccountGroupsSaga(action) {

  try {
    const response = yield call(addAccountGroupsApiCall,'','',action.payload.Id,true,action.payload.account_group_type)
   yield put(deleteAccountGroups(response))
  } catch (error) {
    yield put(getAccountGroupsFail(error))
  }
}

function* accountGroupsAllSaga() {
  yield takeEvery(ADD_ACCOUNTGROUPS_REQUEST, addAccountGroupsSaga)
  yield takeEvery(UPDATE_ACCOUNTGROUPS_REQUEST, updateAccountGroupsSaga)
  yield takeEvery(DELETE_ACCOUNTGROUPS_REQUEST, deleteAccountGroupsSaga)
  yield takeEvery(GET_ACCOUNTGROUPS_REQUEST, accountgroupsSaga)
}

export {accountGroupsAllSaga} 