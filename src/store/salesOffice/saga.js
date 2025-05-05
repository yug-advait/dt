import { takeEvery,call, put } from "redux-saga/effects";
import { getSalesOfficeSuccess, getSalesOfficeFail,addSalesOffice,updateSalesOffice,deleteSalesOffice } from "./actions";
import { ADD_SALESOFFICE_REQUEST,GET_SALESOFFICE_REQUEST,UPDATE_SALESOFFICE_REQUEST,DELETE_SALESOFFICE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getSalesOffice,addSalesOfficeApiCall } from "helpers/Api/api_salesOffice";

function* salesOfficeSaga() {
  try {
    const response = yield call(getSalesOffice)
    yield put(getSalesOfficeSuccess(response))
  } catch (error) {
    yield put(getSalesOfficeFail(error));
  }
}

function* addSalesOfficeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addSalesOfficeApiCall,formData,isActive,0,false)
   yield put(addSalesOffice(response));
  } catch (error) {
    yield put(getSalesOfficeFail(error));
  }
}
function* updateSalesOfficeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addSalesOfficeApiCall,formData,isActive,Id,false)
   yield put(updateSalesOffice(response));
  } catch (error) {
    yield put(getSalesOfficeFail(error));
  }
}
function* deleteSalesOfficeSaga(action) {
  try {
    const response = yield call(addSalesOfficeApiCall,'','',action.payload,true)
   yield put(deleteSalesOffice(response))
  } catch (error) {
    yield put(getSalesOfficeFail(error))
  }
}

function* salesOfficeAllSaga() {
  yield takeEvery(ADD_SALESOFFICE_REQUEST, addSalesOfficeSaga)
  yield takeEvery(UPDATE_SALESOFFICE_REQUEST, updateSalesOfficeSaga)
  yield takeEvery(DELETE_SALESOFFICE_REQUEST, deleteSalesOfficeSaga)
  yield takeEvery(GET_SALESOFFICE_REQUEST, salesOfficeSaga)
}

export {salesOfficeAllSaga} 