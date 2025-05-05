import { GET_RFQDOCTYPE, ADD_RFQDOCTYPE_SUCCESS, GET_RFQDOCTYPE_FAIL, GET_RFQDOCTYPE_SUCCESS,
  UPDATE_RFQDOCTYPE_SUCCESS,DELETE_RFQDOCTYPE_SUCCESS
 } from "./actionTypes"
export const getRfqDoctype = () => ({
  type: GET_RFQDOCTYPE,
})

export const getRfqDocTypeSuccess = rfqdoctype => 
  ({
  type: GET_RFQDOCTYPE_SUCCESS,
  payload: rfqdoctype,
})

export const addRfqDocType = rfqDocTypeData => ({
  type: ADD_RFQDOCTYPE_SUCCESS,
  payload: rfqDocTypeData,
});

export const updateRfqDocType = rfqDocTypeData => ({
  type: UPDATE_RFQDOCTYPE_SUCCESS,
  payload: rfqDocTypeData,
});

export const deleteRfqDocType = rfqDocTypeData => ({
  type: DELETE_RFQDOCTYPE_SUCCESS,
  payload: rfqDocTypeData,
});

export const getRfqDocTypeFail = error => ({
  type: GET_RFQDOCTYPE_FAIL,
  payload: error,
})
