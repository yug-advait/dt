import { takeEvery,call, put } from "redux-saga/effects";
import { getUnitOfMeasureSuccess, getUnitOfMeasureFail,addUnitOfMeasure,updateUnitOfMeasure,deleteUnitOfMeasure } from "./actions";
import { ADD_UNITOFMEASURE_REQUEST,GET_UNITOFMEASURE_REQUEST,UPDATE_UNITOFMEASURE_REQUEST,DELETE_UNITOFMEASURE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getUnitOfMeasure,addUnitOfMeasureApiCall } from "helpers/Api/api_unitOfMeasure";

function* unitOfMeasureSaga() {
  try {
    const response = yield call(getUnitOfMeasure)
    yield put(getUnitOfMeasureSuccess(response))
  } catch (error) {
    yield put(getUnitOfMeasureFail(error));
  }
}

function* addUnitOfMeasureSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addUnitOfMeasureApiCall,formData,isActive,0,false)
   yield put(addUnitOfMeasure(response));
  } catch (error) {
    yield put(getUnitOfMeasureFail(error));
  }
}
function* updateUnitOfMeasureSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addUnitOfMeasureApiCall,formData,isActive,Id,false)
   yield put(updateUnitOfMeasure(response));
  } catch (error) {
    yield put(getUnitOfMeasureFail(error));
  }
}
function* deleteUnitOfMeasureSaga(action) {
  try {
    const response = yield call(addUnitOfMeasureApiCall,'','',action.payload,true)
   yield put(deleteUnitOfMeasure(response))
  } catch (error) {
    yield put(getUnitOfMeasureFail(error))
  }
}

function* unitOfMeasureAllSaga() {
  yield takeEvery(ADD_UNITOFMEASURE_REQUEST, addUnitOfMeasureSaga)
  yield takeEvery(UPDATE_UNITOFMEASURE_REQUEST, updateUnitOfMeasureSaga)
  yield takeEvery(DELETE_UNITOFMEASURE_REQUEST, deleteUnitOfMeasureSaga)
  yield takeEvery(GET_UNITOFMEASURE_REQUEST, unitOfMeasureSaga)
}

export {unitOfMeasureAllSaga} 