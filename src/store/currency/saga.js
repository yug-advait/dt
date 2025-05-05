import { takeEvery,call, put } from "redux-saga/effects";
import { getCurrencySuccess, getCurrencyFail,addCurrency,updateCurrency,deleteCurrency } from "./actions";
import { ADD_CURRENCY_REQUEST,GET_CURRENCY_REQUEST,UPDATE_CURRENCY_REQUEST,DELETE_CURRENCY_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCurrency,addCurrencyApiCall } from "helpers/Api/api_currency";

function* currencySaga() {
  try {
    const response = yield call(getCurrency)
    yield put(getCurrencySuccess(response))
  } catch (error) {
    yield put(getCurrencyFail(error));
  }
}

function* addCurrencySaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addCurrencyApiCall,formData,isActive,0,false)
   yield put(addCurrency(response));
  } catch (error) {
    yield put(getCurrencyFail(error));
  }
}
function* updateCurrencyaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addCurrencyApiCall,formData,isActive,Id,false)
   yield put(updateCurrency(response));
  } catch (error) {
    yield put(getCurrencyFail(error));
  }
}
function* deleteCurrencySaga(action) {
  try {
    const response = yield call(addCurrencyApiCall,'','',action.payload,true)
   yield put(deleteCurrency(response))
  } catch (error) {
    yield put(getCurrencyFail(error))
  }
}

function* currencyAllSaga() {
  yield takeEvery(ADD_CURRENCY_REQUEST, addCurrencySaga)
  yield takeEvery(UPDATE_CURRENCY_REQUEST, updateCurrencyaga)
  yield takeEvery(DELETE_CURRENCY_REQUEST, deleteCurrencySaga)
  yield takeEvery(GET_CURRENCY_REQUEST, currencySaga)
}

export {currencyAllSaga} 