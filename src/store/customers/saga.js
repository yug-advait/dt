import { takeEvery,call, put } from "redux-saga/effects";
import { getCustomersSuccess, getCustomersFail,addCustomers,updateCustomers,
  deleteCustomers } from "./actions";
import { ADD_CUSTOMERS_REQUEST,GET_CUSTOMERS_REQUEST,UPDATE_CUSTOMERS_REQUEST,DELETE_CUSTOMERS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCustomers,addCustomersApiCall } from "helpers/Api/api_customers";

function* CustomersSaga() {
  try {
    const response = yield call(getCustomers)
    yield put(getCustomersSuccess(response))
  } catch (error) {
    yield put(getCustomersFail(error));
  }
}

function* addCustomersSaga(action) {
  const {formData } = action.payload
  try {
    const response = yield call(addCustomersApiCall,formData,true,0,false)
   yield put(addCustomers(response));
  } catch (error) {
    yield put(getCustomersFail(error));
  }
}
function* updateCustomersSaga(action) {
  const {formData,Id } = action.payload
  try {
    const response = yield call(addCustomersApiCall,formData,true,Id,false)
   yield put(updateCustomers(response));
  } catch (error) {
    yield put(getCustomersFail(error));
  }
}
function* deleteCustomersSaga(action) {
  try {
    const response = yield call(addCustomersApiCall,'','',action.payload,true)
   yield put(deleteCustomers(response))
  } catch (error) {
    yield put(getCustomersFail(error))
  }
}

function* customersAllSaga() {
  yield takeEvery(ADD_CUSTOMERS_REQUEST, addCustomersSaga)
  yield takeEvery(UPDATE_CUSTOMERS_REQUEST, updateCustomersSaga)
  yield takeEvery(DELETE_CUSTOMERS_REQUEST, deleteCustomersSaga)
  yield takeEvery(GET_CUSTOMERS_REQUEST, CustomersSaga)
}

export {customersAllSaga} 