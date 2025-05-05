import { GET_PRDOCTYPE, ADD_PRDOCTYPE_SUCCESS, GET_PRDOCTYPE_FAIL, GET_PRDOCTYPE_SUCCESS,
  UPDATE_PRDOCTYPE_SUCCESS,DELETE_PRDOCTYPE_SUCCESS
 } from "./actionTypes"
export const getPrDoctype = () => ({
  type: GET_PRDOCTYPE,
})

export const getPrDocTypeSuccess = prdoctype => 
  ({
  type: GET_PRDOCTYPE_SUCCESS,
  payload: prdoctype,
})

export const addPrDocType = prDocTypeData => ({
  type: ADD_PRDOCTYPE_SUCCESS,
  payload: prDocTypeData,
});

export const updatePrDocType = prDocTypeData => ({
  type: UPDATE_PRDOCTYPE_SUCCESS,
  payload: prDocTypeData,
});

export const deletePrDocType = prDocTypeData => ({
  type: DELETE_PRDOCTYPE_SUCCESS,
  payload: prDocTypeData,
});

export const getPrDocTypeFail = error => ({
  type: GET_PRDOCTYPE_FAIL,
  payload: error,
})
