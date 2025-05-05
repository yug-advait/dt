import { GET_GOODRECEIPT, ADD_GOODRECEIPT_SUCCESS, GET_GOODRECEIPT_FAIL, GET_GOODRECEIPT_SUCCESS,
  UPDATE_GOODRECEIPT_SUCCESS,DELETE_GOODRECEIPT_SUCCESS
 } from "./actionTypes"
export const getGoodReceipt = () => ({
  type: GET_GOODRECEIPT,
})

export const getGoodReceiptSuccess = GoodReceipt => ({
  type: GET_GOODRECEIPT_SUCCESS,
  payload: GoodReceipt,
})

export const addGoodReceipt= GoodReceiptData => ({
  type: ADD_GOODRECEIPT_SUCCESS,
  payload: GoodReceiptData,
});

export const updateGoodReceipt = GoodReceiptData => ({
  type: UPDATE_GOODRECEIPT_SUCCESS,
  payload: GoodReceiptData,
});

export const deleteGoodReceipt = GoodReceiptData => ({
  type: DELETE_GOODRECEIPT_SUCCESS,
  payload: GoodReceiptData,
});

export const getGoodReceiptFail = error => ({
  type: GET_GOODRECEIPT_FAIL,
  payload: error,
})
