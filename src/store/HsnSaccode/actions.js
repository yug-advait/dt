import { GET_HSNSAC, ADD_HSNSAC_SUCCESS, GET_HSNSAC_FAIL, GET_HSNSAC_SUCCESS,
  UPDATE_HSNSAC_SUCCESS,DELETE_HSNSAC_SUCCESS
 } from "./actionTypes"
export const getHsnSac = () => ({
  type: GET_HSNSAC,
})

export const getHsnSacSuccess = HsnSac => ({
  type: GET_HSNSAC_SUCCESS,
  payload: HsnSac,
})

export const addHsnSac= HsnSacData => ({
  type: ADD_HSNSAC_SUCCESS,
  payload: HsnSacData,
});

export const updateHsnSac = HsnSacData => ({
  type: UPDATE_HSNSAC_SUCCESS,
  payload: HsnSacData,
});

export const deleteHsnSac = HsnSacData => ({
  type: DELETE_HSNSAC_SUCCESS,
  payload: HsnSacData,
});

export const getHsnSacFail = error => ({
  type: GET_HSNSAC_FAIL,
  payload: error,
})
