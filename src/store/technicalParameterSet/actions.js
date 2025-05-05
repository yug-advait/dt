import { GET_TECHSET, ADD_TECHSET_SUCCESS, GET_TECHSET_FAIL, GET_TECHSET_SUCCESS,
  UPDATE_TECHSET_SUCCESS,DELETE_TECHSET_SUCCESS
 } from "./actionTypes"
export const getTechSet = () => ({
  type: GET_TECHSET,
})
                                                                
export const getTechSetSuccess = techSet => 
  ({
  type: GET_TECHSET_SUCCESS,
  payload: techSet,
})

export const addTechSet= techSetData => ({
  type: ADD_TECHSET_SUCCESS,
  payload: techSetData,
});

export const updateTechSet = techSetData => ({
  type: UPDATE_TECHSET_SUCCESS,
  payload: techSetData,
});

export const deleteTechSet = techSetData => ({
  type: DELETE_TECHSET_SUCCESS,
  payload: techSetData,
});

export const getTechSetFail = error => ({
  type: GET_TECHSET_FAIL,
  payload: error,
})
