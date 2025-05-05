import { takeEvery,call, put } from "redux-saga/effects";
import { getInvoiceSuccess, getInvoiceFail,addInvoice,updateInvoice,
  deleteInvoice } from "./actions";
import { ADD_INVOICE_REQUEST,GET_INVOICE_REQUEST,UPDATE_INVOICE_REQUEST,DELETE_INVOICE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getInvoice,addInvoiceApiCall } from "helpers/Api/api_invoice";

function* invoice() {
  try {
    const response = yield call(getInvoice)
    yield put(getInvoiceSuccess(response))
  } catch (error) {
    yield put(getInvoiceFail(error));
  }
}

function* addInvoiceSaga(action) {
  const {formData,filteredItems } = action.payload
  try {
    const response = yield call(addInvoiceApiCall,formData,filteredItems,0,false)
   yield put(addInvoice(response));
  } catch (error) {
    yield put(getInvoiceFail(error));
  }
}
function* updateInvoiceSaga(action) {
  const {formData,filteredItems,Id } = action.payload
  try {
    const response = yield call(addInvoiceApiCall,formData,filteredItems,Id,false)
   yield put(updateInvoice(response));
  } catch (error) {
    yield put(getInvoiceFail(error));
  }
}
function* deleteInvoiceSaga(action) {
  try {
    const response = yield call(addInvoiceApiCall,'','',action.payload,true)
   yield put(deleteInvoice(response))
  } catch (error) {
    yield put(getInvoiceFail(error))
  }
}

function* invoiceAllSaga() {
  yield takeEvery(ADD_INVOICE_REQUEST, addInvoiceSaga)
  yield takeEvery(UPDATE_INVOICE_REQUEST, updateInvoiceSaga)
  yield takeEvery(DELETE_INVOICE_REQUEST, deleteInvoiceSaga)
  yield takeEvery(GET_INVOICE_REQUEST, invoice)
}

export {invoiceAllSaga} 