import { GET_PODOCTYPE, ADD_PODOCTYPE_SUCCESS, GET_PODOCTYPE_FAIL, GET_PODOCTYPE_SUCCESS,
  UPDATE_PODOCTYPE_SUCCESS,DELETE_PODOCTYPE_SUCCESS
 } from "./actionTypes"
export const getPoDoctype = () => ({
  type: GET_PODOCTYPE,
})

export const getPoDocTypeSuccess = podoctype => 
  ({
  type: GET_PODOCTYPE_SUCCESS,
  payload: podoctype,
})

export const addPoDocType = poDocTypeData => ({
  type: ADD_PODOCTYPE_SUCCESS,
  payload: poDocTypeData,
});

export const updatePoDocType = poDocTypeData => ({
  type: UPDATE_PODOCTYPE_SUCCESS,
  payload: poDocTypeData,
});

export const deletePoDocType = poDocTypeData => ({
  type: DELETE_PODOCTYPE_SUCCESS,
  payload: poDocTypeData,
});

export const getPoDocTypeFail = error => ({
  type: GET_PODOCTYPE_FAIL,
  payload: error,
})
