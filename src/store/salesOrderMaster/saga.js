// Import necessary files and packages
import { takeEvery, call, put } from "redux-saga/effects";
import { getSalesOrderSuccess, getSalesOrderMasterFail, addSalesOrder, updateSalesOrder, deleteSalesOrder } from './actions';
import { GET_SALES_ORDER_REQUEST, ADD_SALES_ORDER_REQUEST, UPDATE_SALES_ORDER_REQUEST, DELETE_SALES_ORDER_REQUEST } from './actionTypes';


// Include both helper file with needed methods;
import { createUpdateDeleteSalesOrder, getSalesOrderMaster } from '../../helpers/Api/api_salesOrderMaster';

// GET Sales Order Master List
function* salesOrderSaga() {
    try {
        const response = yield call(getSalesOrderMaster);
        yield put(getSalesOrderSuccess(response));
    }
    catch (error) {
        yield put(getSalesOrderMasterFail(error));
    }
};

// POST : Create new Sales Order
function* createSalesOrderSaga(action) {
    const { formData, so_details } = action.payload;
    try {
        const response = yield call(createUpdateDeleteSalesOrder, 0, formData, so_details, false);
        yield put(addSalesOrder(response));
    }
    // Handle Errors and Exception
    catch (error) {
        yield put(getSalesOrderMasterFail(error));
    }
};

// POST : Update Existing Sales Order
function* updateSalesOrderSaga(action) {
    const { id, formData, so_details } = action.payload;
    try {
        const response = yield call(createUpdateDeleteSalesOrder, id, formData, so_details, false);
        yield put(updateSalesOrder(response));
    }
    // Handle Errors and Exceptions
    catch (error) {
        yield put(getSalesOrderMasterFail(error));
    }
};

// POST : Delete Sales Order
function* deleteSalesOrderSaga(action) {
    try {
        const response = yield call(createUpdateDeleteSalesOrder, action.payload, "", "", true);
        yield put(deleteSalesOrder(response));
    }
    // Handle Errors and Exceptions
    catch (error) {
        yield put(getSalesOrderMasterFail(error));
    }
}

// All SalesOrdersSaga
function* salesOrderAllSaga() {
    yield takeEvery(GET_SALES_ORDER_REQUEST, salesOrderSaga);
    yield takeEvery(ADD_SALES_ORDER_REQUEST, createSalesOrderSaga);
    yield takeEvery(UPDATE_SALES_ORDER_REQUEST, updateSalesOrderSaga);
    yield takeEvery(DELETE_SALES_ORDER_REQUEST, deleteSalesOrderSaga);
}

export { salesOrderAllSaga };