import { GET_PRITEM, ADD_PRITEM_SUCCESS, GET_PRITEM_FAIL, GET_PRITEM_SUCCESS,
  UPDATE_PRITEM_SUCCESS,DELETE_PRITEM_SUCCESS
 } from "./actionTypes"
export const getPrItem = () => ({
  type: GET_PRITEM,
})

export const getPrItemSuccess = pritem => 
  ({
  type: GET_PRITEM_SUCCESS,
  payload: pritem,
})

export const addPrItem = prItemData => ({
  type: ADD_PRITEM_SUCCESS,
  payload: prItemData,
});

export const updatePrItem = prItemData => ({
  type: UPDATE_PRITEM_SUCCESS,
  payload: prItemData,
});

export const deletePrItem = prItemData => ({
  type: DELETE_PRITEM_SUCCESS,
  payload: prItemData,
});

export const getPrItemFail = error => ({
  type: GET_PRITEM_FAIL,
  payload: error,
})
