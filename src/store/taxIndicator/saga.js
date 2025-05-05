import { takeEvery, call, put } from "redux-saga/effects";
import { getTaxIndicatorSuccess, getTaxIndicatorFail, addTaxIndicator, updateTaxIndicator, deleteTaxIndicator } from "./actions";
import { ADD_TAXINDICATOR_REQUEST, GET_TAXINDICATOR_REQUEST, UPDATE_TAXINDICATOR_REQUEST, DELETE_TAXINDICATOR_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getTaxIndicator, addTaxIndicatorApiCall } from "helpers/Api/api_taxIndicator";

function* TaxIndicatorSaga(action) {
  const { tax_indicator_type } = action.payload;
  try {
    const response = yield call(getTaxIndicator, tax_indicator_type)
    yield put(getTaxIndicatorSuccess(response))
  } catch (error) {
    yield put(getTaxIndicatorFail(error));
  }
}

function* addTaxIndicatorSaga(action) {
  const { formData, isActive, tax_indicator_type } = action.payload
  try {
    const response = yield call(addTaxIndicatorApiCall, formData, isActive, 0, false, tax_indicator_type)
    yield put(addTaxIndicator(response));
  } catch (error) {
    yield put(getTaxIndicatorFail(error));
  }
}
function* updateTaxIndicatorSaga(action) {
  const { formData, isActive, Id, tax_indicator_type } = action.payload
  try {
    const response = yield call(addTaxIndicatorApiCall, formData, isActive, Id, false, tax_indicator_type)
    yield put(updateTaxIndicator(response));
  } catch (error) {
    yield put(getTaxIndicatorFail(error));
  }
}
function* deleteTaxIndicatorSaga(action) {
  try {
    const response = yield call(addTaxIndicatorApiCall, '', '', action.payload.Id, true, action.payload.tax_indicator_type)
    yield put(deleteTaxIndicator(response))
  } catch (error) {
    yield put(getTaxIndicatorFail(error))
  }
}

function* TaxIndicatorAllSaga() {
  yield takeEvery(ADD_TAXINDICATOR_REQUEST, addTaxIndicatorSaga)
  yield takeEvery(UPDATE_TAXINDICATOR_REQUEST, updateTaxIndicatorSaga)
  yield takeEvery(DELETE_TAXINDICATOR_REQUEST, deleteTaxIndicatorSaga)
  yield takeEvery(GET_TAXINDICATOR_REQUEST, TaxIndicatorSaga)
}

export { TaxIndicatorAllSaga } 