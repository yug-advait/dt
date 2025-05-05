import { GET_SALESGROUP, ADD_SALESGROUP_SUCCESS, GET_SALESGROUP_FAIL, GET_SALESGROUP_SUCCESS,
  UPDATE_SALESGROUP_SUCCESS,DELETE_SALESGROUP_SUCCESS
 } from "./actionTypes"
export const getSalesGroup = () => ({
  type: GET_SALESGROUP,
})

export const getSalesGroupSuccess = SalesGroup => ({
  type: GET_SALESGROUP_SUCCESS,
  payload: SalesGroup,
})

export const addSalesGroup= SalesGroupData => ({
  type: ADD_SALESGROUP_SUCCESS,
  payload: SalesGroupData,
});

export const updateSalesGroup = SalesGroupData => ({
  type: UPDATE_SALESGROUP_SUCCESS,
  payload: SalesGroupData,
});

export const deleteSalesGroup = SalesGroupData => ({
  type: DELETE_SALESGROUP_SUCCESS,
  payload: SalesGroupData,
});

export const getSalesGroupFail = error => ({
  type: GET_SALESGROUP_FAIL,
  payload: error,
})
