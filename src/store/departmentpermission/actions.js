import { GET_DEPARTMENTPERMISSION, ADD_DEPARTMENTPERMISSION_SUCCESS, GET_DEPARTMENTPERMISSION_FAIL, GET_DEPARTMENTPERMISSION_SUCCESS,
  UPDATE_DEPARTMENTPERMISSION_SUCCESS,DELETE_DEPARTMENTPERMISSION_SUCCESS
 } from "./actionTypes"
export const getDepartmentPermission = () => ({
  type: GET_DEPARTMENTPERMISSION,
})

export const getDepartmentPermissionSuccess = DepartmentPermission => ({
  type: GET_DEPARTMENTPERMISSION_SUCCESS,
  payload: DepartmentPermission,
})

export const addDepartmentPermission= DepartmentPermissionData => ({
  type: ADD_DEPARTMENTPERMISSION_SUCCESS,
  payload: DepartmentPermissionData,
});

export const updateDepartmentPermission = DepartmentPermissionData => ({
  type: UPDATE_DEPARTMENTPERMISSION_SUCCESS,
  payload: DepartmentPermissionData,
});

export const deleteDepartmentPermission = DepartmentPermissionData => ({
  type: DELETE_DEPARTMENTPERMISSION_SUCCESS,
  payload: DepartmentPermissionData,
});

export const getDepartmentPermissionFail = error => ({
  type: GET_DEPARTMENTPERMISSION_FAIL,
  payload: error,
})
