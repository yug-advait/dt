import { takeEvery, call, put } from "redux-saga/effects";
import { getSalesOrderDocTypeSuccess, getSalesOrderDocTypeFail, addSalesOrderDocType, updateSalesOrderDocType, deleteSalesOrderDocType } from "./actions";
import { ADD_SALES_ORDER_DOCTYPE_REQUEST, GET_SALES_ORDER_DOCTYPE_REQUEST, UPDATE_SALES_ORDER_DOCTYPE_REQUEST, DELETE_SALES_ORDER_DOCTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getSalesOrderDocType, createUpdateDeleteSalesOrderDocTypeApiCall } from "helpers/Api/api_salesOrderDocType";

function* salesOrderDocTypeSaga() {
    try {
        const response = yield call(getSalesOrderDocType)
        yield put(getSalesOrderDocTypeSuccess(response))
    } catch (error) {
        yield put(getSalesOrderDocTypeFail(error));
    }
}

function* addSalesOrderDocTypeSaga(action) {
    const { formData } = action.payload
    try {
        const response = yield call(createUpdateDeleteSalesOrderDocTypeApiCall, 0, formData, false)
        yield put(addSalesOrderDocType(response));
    } catch (error) {
        yield put(getSalesOrderDocTypeFail(error));
    }
}
function* updateSalesOrderDocTypeSaga(action) {
    const { Id, formData } = action.payload
    try {
        const response = yield call(createUpdateDeleteSalesOrderDocTypeApiCall, Id, formData, false)
        yield put(updateSalesOrderDocType(response));
    } catch (error) {
        yield put(getSalesOrderDocTypeFail(error));
    }
}
function* deleteSalesOrderDocTypeSaga(action) {
    try {
        const response = yield call(createUpdateDeleteSalesOrderDocTypeApiCall, action.payload, '', true)
        yield put(deleteSalesOrderDocType(response))
    } catch (error) {
        yield put(getSalesOrderDocTypeFail(error))
    }
}

function* salesOrderDocTypeAllSaga() {
    yield takeEvery(ADD_SALES_ORDER_DOCTYPE_REQUEST, addSalesOrderDocTypeSaga)
    yield takeEvery(UPDATE_SALES_ORDER_DOCTYPE_REQUEST, updateSalesOrderDocTypeSaga)
    yield takeEvery(DELETE_SALES_ORDER_DOCTYPE_REQUEST, deleteSalesOrderDocTypeSaga)
    yield takeEvery(GET_SALES_ORDER_DOCTYPE_REQUEST, salesOrderDocTypeSaga)
}

export { salesOrderDocTypeAllSaga } 