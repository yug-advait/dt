import { GET_GRNDOCTYPE, ADD_GRNDOCTYPE_SUCCESS, GET_GRNDOCTYPE_FAIL, GET_GRNDOCTYPE_SUCCESS,
  UPDATE_GRNDOCTYPE_SUCCESS,DELETE_GRNDOCTYPE_SUCCESS
 } from "./actionTypes"
export const getGrnDoctype = () => ({
  type: GET_GRNDOCTYPE,
})

export const getGrnDocTypeSuccess = grndoctype => 
  ({
  type: GET_GRNDOCTYPE_SUCCESS,
  payload: grndoctype,
})

export const addGrnDocType = grnDocTypeData => ({
  type: ADD_GRNDOCTYPE_SUCCESS,
  payload: grnDocTypeData,
});

export const updateGrnDocType = grnDocTypeData => ({
  type: UPDATE_GRNDOCTYPE_SUCCESS,
  payload: grnDocTypeData,
});

export const deleteGrnDocType = grnDocTypeData => ({
  type: DELETE_GRNDOCTYPE_SUCCESS,
  payload: grnDocTypeData,
});

export const getGrnDocTypeFail = error => ({
  type: GET_GRNDOCTYPE_FAIL,
  payload: error,
})
