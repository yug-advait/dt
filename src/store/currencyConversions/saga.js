import { takeEvery,call, put } from "redux-saga/effects";
import { getCurrencyConversionsSuccess, getCurrencyConversionsFail,addCurrencyConversions,updateCurrencyConversions,deleteCurrencyConversions } from "./actions";
import { ADD_CURRENCYCONVERSIONS_REQUEST,GET_CURRENCYCONVERSIONS_REQUEST,UPDATE_CURRENCYCONVERSIONS_REQUEST,DELETE_CURRENCYCONVERSIONS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCurrencyConversions,addCurrencyConversionsApiCall } from "helpers/Api/api_currencyConversion";

function*currencyconversionsSaga() {
  try {
    const response = yield call(getCurrencyConversions)
    yield put(getCurrencyConversionsSuccess(response))
  } catch (error) {
    yield put(getCurrencyConversionsFail(error));
  }
}

function* addCurrencyConversionsSaga(action) {
  const {formData,isActive,CValue } = action.payload
  try {
    const response = yield call(addCurrencyConversionsApiCall,formData,isActive,0,false,CValue)
   yield put(addCurrencyConversions(response));
  } catch (error) {
    yield put(getCurrencyConversionsFail(error));
  }
}
function* updateCurrencyConversionsSaga(action) {
  const {formData,isActive,Id,CValue } = action.payload
  try {
    const response = yield call(addCurrencyConversionsApiCall,formData,isActive,Id,false,CValue)
   yield put(updateCurrencyConversions(response));
  } catch (error) {
    yield put(getCurrencyConversionsFail(error));
  }
}
function* deleteCurrencyConversionsSaga(action) {
  try {
    const response = yield call(addCurrencyConversionsApiCall,'','',action.payload,true,'')
   yield put(deleteCurrencyConversions(response))
  } catch (error) {
    yield put(getCurrencyConversionsFail(error))
  }
}

function* currencyConversionsAllSaga() {
  yield takeEvery(ADD_CURRENCYCONVERSIONS_REQUEST, addCurrencyConversionsSaga)
  yield takeEvery(UPDATE_CURRENCYCONVERSIONS_REQUEST, updateCurrencyConversionsSaga)
  yield takeEvery(DELETE_CURRENCYCONVERSIONS_REQUEST, deleteCurrencyConversionsSaga)
  yield takeEvery(GET_CURRENCYCONVERSIONS_REQUEST,currencyconversionsSaga)
}

export {currencyConversionsAllSaga} 