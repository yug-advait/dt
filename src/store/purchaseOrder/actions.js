import { GET_PO, ADD_PO_SUCCESS, GET_PO_FAIL, GET_PO_SUCCESS,
  UPDATE_PO_SUCCESS,DELETE_PO_SUCCESS
 } from "./actionTypes"
export const getPo = () => ({
  type: GET_PO,
})

export const getPoSuccess = Po => ({
  type: GET_PO_SUCCESS,
  payload: Po,
})

export const addPo= PoData => ({
  type: ADD_PO_SUCCESS,
  payload: PoData,
});

export const updatePo = PoData => ({
  type: UPDATE_PO_SUCCESS,
  payload: PoData,
});

export const deletePo = PoData => ({
  type: DELETE_PO_SUCCESS,
  payload: PoData,
});

export const getPoFail = error => ({
  type: GET_PO_FAIL,
  payload: error,
})
