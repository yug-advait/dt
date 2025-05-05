import { GET_ADMINS, ADD_ADMINS_SUCCESS, GET_ADMINS_FAIL, GET_ADMINS_SUCCESS,
  UPDATE_ADMINS_SUCCESS,DELETE_ADMINS_SUCCESS
 } from "./actionTypes"
export const getAdmins = () => ({
  type: GET_ADMINS,
})

export const getAdminsSuccess = Admins => ({
  type: GET_ADMINS_SUCCESS,
  payload: Admins,
})

export const addAdmins= AdminsData => ({
  type: ADD_ADMINS_SUCCESS,
  payload: AdminsData,
});

export const updateAdmins = AdminsData => ({
  type: UPDATE_ADMINS_SUCCESS,
  payload: AdminsData,
});

export const deleteAdmins = AdminsData => ({
  type: DELETE_ADMINS_SUCCESS,
  payload: AdminsData,
});

export const getAdminsFail = error => ({
  type: GET_ADMINS_FAIL,
  payload: error,
})
