import { takeEvery,call, put } from "redux-saga/effects";
import { getCitiesSuccess, getCitiesFail,addCities,updateCities,deleteCities } from "./actions";
import { ADD_CITIES_REQUEST,GET_CITIES_REQUEST,UPDATE_CITIES_REQUEST,DELETE_CITIES_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCities,addCitiesApiCall } from "helpers/Api/api_cities";

function* citiesSaga() {
  try {
    const response = yield call(getCities)
    yield put(getCitiesSuccess(response))
  } catch (error) {
    yield put(getCitiesFail(error));
  }
}

function* addCitiesSaga(action) {
  const {formData,selectCountry,isActive } = action.payload
  try {
    const response = yield call(addCitiesApiCall,formData,selectCountry,isActive,0,false)
   yield put(addCities(response));
  } catch (error) {
    yield put(getCitiesFail(error));
  }
}
function* updateCitiesSaga(action) {
  const {formData,selectCountry,isActive,Id } = action.payload
  try {
    const response = yield call(addCitiesApiCall,formData,selectCountry,isActive,Id,false)
   yield put(updateCities(response));
  } catch (error) {
    yield put(getCitiesFail(error));
  }
}
function* deleteCitiesSaga(action) {
  try {
    const response = yield call(addCitiesApiCall,'','','',action.payload,true)
   yield put(deleteCities(response))
  } catch (error) {
    yield put(getCitiesFail(error))
  }
}

function* citiesAllSaga() {
  yield takeEvery(ADD_CITIES_REQUEST, addCitiesSaga)
  yield takeEvery(UPDATE_CITIES_REQUEST, updateCitiesSaga)
  yield takeEvery(DELETE_CITIES_REQUEST, deleteCitiesSaga)
  yield takeEvery(GET_CITIES_REQUEST, citiesSaga)
}

export {citiesAllSaga} 