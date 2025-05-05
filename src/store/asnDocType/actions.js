import { GET_ASNDOCTYPE, ADD_ASNDOCTYPE_SUCCESS, GET_ASNDOCTYPE_FAIL, GET_ASNDOCTYPE_SUCCESS,
  UPDATE_ASNDOCTYPE_SUCCESS,DELETE_ASNDOCTYPE_SUCCESS
 } from "./actionTypes"
export const getAsnDoctype = () => ({
  type: GET_ASNDOCTYPE,
})

export const getAsnDocTypeSuccess = asndoctype => 
  ({
  type: GET_ASNDOCTYPE_SUCCESS,
  payload: asndoctype,
})

export const addAsnDocType = asnDocTypeData => ({
  type: ADD_ASNDOCTYPE_SUCCESS,
  payload: asnDocTypeData,
});

export const updateAsnDocType = asnDocTypeData => ({
  type: UPDATE_ASNDOCTYPE_SUCCESS,
  payload: asnDocTypeData,
});

export const deleteAsnDocType = asnDocTypeData => ({
  type: DELETE_ASNDOCTYPE_SUCCESS,
  payload: asnDocTypeData,
});

export const getAsnDocTypeFail = error => ({
  type: GET_ASNDOCTYPE_FAIL,
  payload: error,
})
