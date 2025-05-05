import { GET_CUSTOMERGROUPS, ADD_CUSTOMERGROUPS_SUCCESS, GET_CUSTOMERGROUPS_FAIL, GET_CUSTOMERGROUPS_SUCCESS,
  UPDATE_CUSTOMERGROUPS_SUCCESS,DELETE_CUSTOMERGROUPS_SUCCESS
 } from "./actionTypes"
export const getCustomerGroups = () => ({
  type: GET_CUSTOMERGROUPS,
})

export const getCustomerGroupsSuccess = customerGroups => 
  ({
  type: GET_CUSTOMERGROUPS_SUCCESS,
  payload: customerGroups,
})

export const addCustomerGroups= accountGroupsData => ({
  type: ADD_CUSTOMERGROUPS_SUCCESS,
  payload: accountGroupsData,
});

export const updateCustomerGroups = accountGroupsData => ({
  type: UPDATE_CUSTOMERGROUPS_SUCCESS,
  payload: accountGroupsData,
});

export const deleteCustomerGroups = accountGroupsData => ({
  type: DELETE_CUSTOMERGROUPS_SUCCESS,
  payload: accountGroupsData,
});

export const getCustomerGroupsFail = error => ({
  type: GET_CUSTOMERGROUPS_FAIL,
  payload: error,
})
