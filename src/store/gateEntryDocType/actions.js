import { GET_GATEENTRYDOCTYPE, ADD_GATEENTRYDOCTYPE_SUCCESS, GET_GATEENTRYDOCTYPE_FAIL, GET_GATEENTRYDOCTYPE_SUCCESS,
  UPDATE_GATEENTRYDOCTYPE_SUCCESS,DELETE_GATEENTRYDOCTYPE_SUCCESS
 } from "./actionTypes"
export const gateEntryDocType = () => ({
  type: GET_GATEENTRYDOCTYPE,
})

export const gateEntryDocTypeSuccess = grndoctype => 
  ({
  type: GET_GATEENTRYDOCTYPE_SUCCESS,
  payload: grndoctype,
})

export const addGateEntryDocType = grnDocTypeData => ({
  type: ADD_GATEENTRYDOCTYPE_SUCCESS,
  payload: grnDocTypeData,
});

export const updateGateEntryDocType = grnDocTypeData => ({
  type: UPDATE_GATEENTRYDOCTYPE_SUCCESS,
  payload: grnDocTypeData,
});

export const deleteGateEntryDocType = grnDocTypeData => ({
  type: DELETE_GATEENTRYDOCTYPE_SUCCESS,
  payload: grnDocTypeData,
});

export const getGateEntryDocTypeFail = error => ({
  type: GET_GATEENTRYDOCTYPE_FAIL,
  payload: error,
})
