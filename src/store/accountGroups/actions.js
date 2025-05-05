import { GET_ACCOUNTGROUPS, ADD_ACCOUNTGROUPS_SUCCESS, GET_ACCOUNTGROUPS_FAIL, GET_ACCOUNTGROUPS_SUCCESS,
  UPDATE_ACCOUNTGROUPS_SUCCESS,DELETE_ACCOUNTGROUPS_SUCCESS
 } from "./actionTypes"
export const getAccountGroups = () => ({
  type: GET_ACCOUNTGROUPS,
})

export const getAccountGroupsSuccess = accountGroups => 
  ({
  type: GET_ACCOUNTGROUPS_SUCCESS,
  payload: accountGroups,
})

export const addAccountGroups= accountGroupsData => ({
  type: ADD_ACCOUNTGROUPS_SUCCESS,
  payload: accountGroupsData,
});

export const updateAccountGroups = accountGroupsData => ({
  type: UPDATE_ACCOUNTGROUPS_SUCCESS,
  payload: accountGroupsData,
});

export const deleteAccountGroups = accountGroupsData => ({
  type: DELETE_ACCOUNTGROUPS_SUCCESS,
  payload: accountGroupsData,
});

export const getAccountGroupsFail = error => ({
  type: GET_ACCOUNTGROUPS_FAIL,
  payload: error,
})
