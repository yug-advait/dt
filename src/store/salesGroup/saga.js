import { takeEvery,call, put } from "redux-saga/effects";
import { getSalesGroupSuccess, getSalesGroupFail,addSalesGroup,updateSalesGroup,
  deleteSalesGroup } from "./actions";
import { ADD_SALESGROUP_REQUEST,GET_SALESGROUP_REQUEST,UPDATE_SALESGROUP_REQUEST,DELETE_SALESGROUP_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getSalesGroup,addSalesGroupApiCall } from "helpers/Api/api_salesgroup";

function* SalesGroupSaga() {
  try {
    const response = yield call(getSalesGroup)
    yield put(getSalesGroupSuccess(response))
  } catch (error) {
    yield put(getSalesGroupFail(error));
  }
}

function* addSalesGroupSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addSalesGroupApiCall,formData,isActive,0,false)
   yield put(addSalesGroup(response));
  } catch (error) {
    yield put(getSalesGroupFail(error));
  }
}
function* updateSalesGroupSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addSalesGroupApiCall,formData,isActive,Id,false)
   yield put(updateSalesGroup(response));
  } catch (error) {
    yield put(getSalesGroupFail(error));
  }
}
function* deleteSalesGroupSaga(action) {
  try {
    const response = yield call(addSalesGroupApiCall,'','',action.payload,true)
   yield put(deleteSalesGroup(response))
  } catch (error) {
    yield put(getSalesGroupFail(error))
  }
}

function* salesgroupAllSaga() {
  yield takeEvery(ADD_SALESGROUP_REQUEST, addSalesGroupSaga)
  yield takeEvery(UPDATE_SALESGROUP_REQUEST, updateSalesGroupSaga)
  yield takeEvery(DELETE_SALESGROUP_REQUEST, deleteSalesGroupSaga)
  yield takeEvery(GET_SALESGROUP_REQUEST, SalesGroupSaga)
}

export {salesgroupAllSaga} 