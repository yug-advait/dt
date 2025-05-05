import { takeEvery,call, put } from "redux-saga/effects";
import { getCountriesSuccess, getCountriesFail,addCountries,updateCountries,deleteCountries } from "./actions";
import { ADD_COUNTRIES_REQUEST,GET_COUNTRIES_REQUEST,UPDATE_COUNTRIES_REQUEST,DELETE_COUNTRIES_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCountries,addCountriesApiCall } from "helpers/Api/api_country";

function* countriesSaga() {
  try {
    const response = yield call(getCountries)
    yield put(getCountriesSuccess(response))
  } catch (error) {
    yield put(getCountriesFail(error));
  }
}

function* addcountriesSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addCountriesApiCall,formData,isActive,0,false)
   yield put(addCountries(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }
}
function* updatecountriesSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addCountriesApiCall,formData,isActive,Id,false)
   yield put(updateCountries(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }
}
function* deletecountriesSaga(action) {
  try {
    const response = yield call(addCountriesApiCall,'','',action.payload,true)
   yield put(deleteCountries(response))
  } catch (error) {
    yield put(getCountriesFail(error))
  }
}

function* countriesAllSaga() {
  yield takeEvery(ADD_COUNTRIES_REQUEST, addcountriesSaga)
  yield takeEvery(UPDATE_COUNTRIES_REQUEST, updatecountriesSaga)
  yield takeEvery(DELETE_COUNTRIES_REQUEST, deletecountriesSaga)
  yield takeEvery(GET_COUNTRIES_REQUEST, countriesSaga)
}

export {countriesAllSaga} 