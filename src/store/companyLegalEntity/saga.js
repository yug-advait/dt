import { takeEvery,call, put } from "redux-saga/effects";
import { getCompanyLegalEntitySuccess, getCompanyLegalEntityFail,addCompanyLegalEntity,updateCompanyLegalEntity,deleteCompanyLegalEntity } from "./actions";
import { ADD_COMPANYLEGALENTITY_REQUEST,GET_COMPANYLEGALENTITY_REQUEST,UPDATE_COMPANYLEGALENTITY_REQUEST,DELETE_COMPANYLEGALENTITY_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCompanyLegalEntity,addCompanyLegalEntityApiCall } from "helpers/Api/api_companyLegalEntity";

function* companyLegalEntitySaga() {
  try {
    const response = yield call(getCompanyLegalEntity)
    yield put(getCompanyLegalEntitySuccess(response))
  } catch (error) {
    yield put(getCompanyLegalEntityFail(error));
  }
}

function* addCompanyLegalEntitySaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addCompanyLegalEntityApiCall,formData,isActive,0,false)
   yield put(addCompanyLegalEntity(response));
  } catch (error) {
    yield put(getCompanyLegalEntityFail(error));
  }
}
function* updateCompanyLegalEntityaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addCompanyLegalEntityApiCall,formData,isActive,Id,false)
   yield put(updateCompanyLegalEntity(response));
  } catch (error) {
    yield put(getCompanyLegalEntityFail(error));
  }
}
function* deleteCompanyLegalEntitySaga(action) {
  try {
    const response = yield call(addCompanyLegalEntityApiCall,'','',action.payload,true)
   yield put(deleteCompanyLegalEntity(response))
  } catch (error) {
    yield put(getCompanyLegalEntityFail(error))
  }
}

function* companyLegalEntityAllSaga() {
  yield takeEvery(ADD_COMPANYLEGALENTITY_REQUEST, addCompanyLegalEntitySaga)
  yield takeEvery(UPDATE_COMPANYLEGALENTITY_REQUEST, updateCompanyLegalEntityaga)
  yield takeEvery(DELETE_COMPANYLEGALENTITY_REQUEST, deleteCompanyLegalEntitySaga)
  yield takeEvery(GET_COMPANYLEGALENTITY_REQUEST, companyLegalEntitySaga)
}

export {companyLegalEntityAllSaga} 