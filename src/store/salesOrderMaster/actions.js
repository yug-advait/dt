// Import Action Types
import {
    GET_SALES_ORDER, GET_SALES_ORDER_FAIL, GET_SALES_ORDER_SUCCESS, ADD_SALES_ORDER_SUCCESS,
    UPDATE_SALES_ORDER_SUCCESS, DELETE_SALES_ORDER_SUCCESS
} from './actionTypes';

// GET : Sales Order Master
export const getSalesOrderMaster = () => ({
    type : GET_SALES_ORDER
});

// GET : Sales Order Master Success
export const getSalesOrderSuccess = salesOrders => ({
    type : GET_SALES_ORDER_SUCCESS,
    payload : salesOrders
});

// POST : Create Sales Order Master
export const addSalesOrder = salesOrderData => ({
    type : ADD_SALES_ORDER_SUCCESS,
    payload : salesOrderData
});

// POST : Update Sales Order Master
export const updateSalesOrder = salesOrderData => ({
    type : UPDATE_SALES_ORDER_SUCCESS,
    payload : salesOrderData
});

// POST : Delete Sales Order Master
export const deleteSalesOrder = salesOrderData => ({
    type : DELETE_SALES_ORDER_SUCCESS,
    payload : salesOrderData
});

// Sales Order Master Fail
export const getSalesOrderMasterFail = error => ({
    type : GET_SALES_ORDER_FAIL,
    payload : error,
});