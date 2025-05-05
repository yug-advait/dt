import { GET_ADMINGROUPS, ADD_ADMINGROUPS_SUCCESS, GET_ADMINGROUPS_FAIL, GET_ADMINGROUPS_SUCCESS,
  UPDATE_ADMINGROUPS_SUCCESS,DELETE_ADMINGROUPS_SUCCESS
 } from "./actionTypes"
export const getAdminGroups = () => ({
  type: GET_ADMINGROUPS,
})

export const getAdminGroupsSuccess = AdminGroups => ({
  type: GET_ADMINGROUPS_SUCCESS,
  payload: AdminGroups,
})

export const addAdminGroups= AdminGroupsData => ({
  type: ADD_ADMINGROUPS_SUCCESS,
  payload: AdminGroupsData,
});

export const updateAdminGroups = AdminGroupsData => ({
  type: UPDATE_ADMINGROUPS_SUCCESS,
  payload: AdminGroupsData,
});

export const deleteAdminGroups = AdminGroupsData => ({
  type: DELETE_ADMINGROUPS_SUCCESS,
  payload: AdminGroupsData,
});

export const getAdminGroupsFail = error => ({
  type: GET_ADMINGROUPS_FAIL,
  payload: error,
})
