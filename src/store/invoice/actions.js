import { GET_INVOICE, ADD_INVOICE_SUCCESS, GET_INVOICE_FAIL, GET_INVOICE_SUCCESS,
  UPDATE_INVOICE_SUCCESS,DELETE_INVOICE_SUCCESS
 } from "./actionTypes"
export const getInvoice = () => ({
  type: GET_INVOICE,
})

export const getInvoiceSuccess = GoodReceipt => ({
  type: GET_INVOICE_SUCCESS,
  payload: GoodReceipt,
})

export const addInvoice= GoodReceiptData => ({
  type: ADD_INVOICE_SUCCESS,
  payload: GoodReceiptData,
});

export const updateInvoice = GoodReceiptData => ({
  type: UPDATE_INVOICE_SUCCESS,
  payload: GoodReceiptData,
});

export const deleteInvoice = GoodReceiptData => ({
  type: DELETE_INVOICE_SUCCESS,
  payload: GoodReceiptData,
});

export const getInvoiceFail = error => ({
  type: GET_INVOICE_FAIL,
  payload: error,
})
