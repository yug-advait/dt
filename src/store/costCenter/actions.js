import { GET_COSTCENTER, ADD_COSTCENTER_SUCCESS, GET_COSTCENTER_FAIL, GET_COSTCENTER_SUCCESS,
  UPDATE_COSTCENTER_SUCCESS,DELETE_COSTCENTER_SUCCESS
 } from "./actionTypes"
export const getCostCenter = () => ({
  type: GET_COSTCENTER,
})

export const getCostCenterSuccess = costcenter => 
  ({
  type: GET_COSTCENTER_SUCCESS,
  payload: costcenter,
})

export const addCostCenter= costcenterData => ({
  type: ADD_COSTCENTER_SUCCESS,
  payload: costcenterData,
});

export const updateCostCenter = costcenterData => ({
  type: UPDATE_COSTCENTER_SUCCESS,
  payload: costcenterData,
});

export const deleteCostCenter = costcenterData => ({
  type: DELETE_COSTCENTER_SUCCESS,
  payload: costcenterData,
});

export const getCostCenterFail = error => ({
  type: GET_COSTCENTER_FAIL,
  payload: error,
})
