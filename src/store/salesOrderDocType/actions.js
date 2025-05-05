import {
    GET_SALES_ORDER_DOCTYPE, ADD_SALES_ORDER_DOCTYPE_SUCCESS, GET_SALES_ORDER_DOCTYPE_FAIL, GET_SALES_ORDER_DOCTYPE_SUCCESS,
    UPDATE_SALES_ORDER_DOCTYPE_SUCCESS, DELETE_SALES_ORDER_DOCTYPE_SUCCESS
} from "./actionTypes"

//GET : Sales Order DOC Type
export const getSalesOrderDoctype = () => ({
    type: GET_SALES_ORDER_DOCTYPE,
})

//GET : Sales Order DOC Type Success
export const getSalesOrderDocTypeSuccess = salesOrderDocType =>
({
    type: GET_SALES_ORDER_DOCTYPE_SUCCESS,
    payload: salesOrderDocType,
})

//POST : Create Sales Order DOC Type
export const addSalesOrderDocType = salesOrderDocTypeData => ({
    type: ADD_SALES_ORDER_DOCTYPE_SUCCESS,
    payload: salesOrderDocTypeData,
});

//POST : Update Sales Order DOC Type
export const updateSalesOrderDocType = salesOrderDocTypeData => ({
    type: UPDATE_SALES_ORDER_DOCTYPE_SUCCESS,
    payload: salesOrderDocTypeData,
});

//POST : Delete Sales Order DOC Type
export const deleteSalesOrderDocType = salesOrderDocTypeData => ({
    type: DELETE_SALES_ORDER_DOCTYPE_SUCCESS,
    payload: salesOrderDocTypeData,
});

//GET : Sales Order DOC Type Fail
export const getSalesOrderDocTypeFail = error => ({
    type: GET_SALES_ORDER_DOCTYPE_FAIL,
    payload: error,
})
