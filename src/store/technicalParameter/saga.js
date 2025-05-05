import { takeEvery,call, put } from "redux-saga/effects";
import { getTechnicalParameterSuccess, getTechnicalParameterFail,addTechnicalParameter,updateTechnicalParameter,deleteTechnicalParameter } from "./actions";
import { ADD_TECHNICALPARAMETER_REQUEST,GET_TECHNICALPARAMETER_REQUEST,UPDATE_TECHNICALPARAMETER_REQUEST,DELETE_TECHNICALPARAMETER_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getTechnicalParameter,addTechnicalParameterApiCall } from "helpers/Api/api_technicalParameter";

function* technicalParameterSaga() {
  try {
    const response = yield call(getTechnicalParameter)
    yield put(getTechnicalParameterSuccess(response))
  } catch (error) {
    yield put(getTechnicalParameterFail(error));
  }
}

function* addTechnicalParameterSaga(action) {
  const {formData,dropDownList,multiSelectList } = action.payload
  try {
    const response = yield call(addTechnicalParameterApiCall,formData,dropDownList,multiSelectList,0,false)
   yield put(addTechnicalParameter(response));
  } catch (error) {
    yield put(getTechnicalParameterFail(error));
  }
}
function* updateTechnicalParameterSaga(action) {
  const {formData,dropDownList,multiSelectList,Id } = action.payload
  try {
    const response = yield call(addTechnicalParameterApiCall,formData,dropDownList,multiSelectList,Id,false)
   yield put(updateTechnicalParameter(response));
  } catch (error) {
    yield put(getTechnicalParameterFail(error));
  }
}
function* deleteTechnicalParameterSaga(action) {
  try {
    const response = yield call(addTechnicalParameterApiCall,'','','',action.payload,true)
   yield put(deleteTechnicalParameter(response))
  } catch (error) {
    yield put(getTechnicalParameterFail(error))
  }
}

function* technicalParameterAllSaga() {
  yield takeEvery(ADD_TECHNICALPARAMETER_REQUEST, addTechnicalParameterSaga)
  yield takeEvery(UPDATE_TECHNICALPARAMETER_REQUEST, updateTechnicalParameterSaga)
  yield takeEvery(DELETE_TECHNICALPARAMETER_REQUEST, deleteTechnicalParameterSaga)
  yield takeEvery(GET_TECHNICALPARAMETER_REQUEST, technicalParameterSaga)
}

export {technicalParameterAllSaga} 