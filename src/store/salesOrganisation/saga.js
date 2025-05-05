import { takeEvery,call, put } from "redux-saga/effects";
import { getSalesOrganisationSuccess, getSalesOrganisationFail,addSalesOrganisation,updateSalesOrganisation,deleteSalesOrganisation } from "./actions";
import { ADD_SALESORGANISATION_REQUEST,GET_SALESORGANISATION_REQUEST,UPDATE_SALESORGANISATION_REQUEST,DELETE_SALESORGANISATION_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getSalesOrganisation,addSalesOrganisationApiCall } from "helpers/Api/api_salesOrganisation";

function* salesorganisationSaga() {
  try {
    const response = yield call(getSalesOrganisation)
    yield put(getSalesOrganisationSuccess(response))
  } catch (error) {
    yield put(getSalesOrganisationFail(error));
  }
}

function* addSalesOrganisationSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addSalesOrganisationApiCall,formData,isActive,0,false)
   yield put(addSalesOrganisation(response));
  } catch (error) {
    yield put(getSalesOrganisationFail(error));
  }
}
function* updateSalesOrganisationSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addSalesOrganisationApiCall,formData,isActive,Id,false)
   yield put(updateSalesOrganisation(response));
  } catch (error) {
    yield put(getSalesOrganisationFail(error));
  }
}
function* deleteSalesOrganisationSaga(action) {
  try {
    const response = yield call(addSalesOrganisationApiCall,'','',action.payload,true)
   yield put(deleteSalesOrganisation(response))
  } catch (error) {
    yield put(getSalesOrganisationFail(error))
  }
}

function* salesorganisationAllSaga() {
  yield takeEvery(ADD_SALESORGANISATION_REQUEST, addSalesOrganisationSaga)
  yield takeEvery(UPDATE_SALESORGANISATION_REQUEST, updateSalesOrganisationSaga)
  yield takeEvery(DELETE_SALESORGANISATION_REQUEST, deleteSalesOrganisationSaga)
  yield takeEvery(GET_SALESORGANISATION_REQUEST, salesorganisationSaga)
}

export {salesorganisationAllSaga} 