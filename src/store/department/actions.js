import { GET_DEPARTMENTS, ADD_DEPARTMENTS_SUCCESS, GET_DEPARTMENTS_FAIL, GET_DEPARTMENTS_SUCCESS,
  UPDATE_DEPARTMENTS_SUCCESS,DELETE_DEPARTMENTS_SUCCESS
 } from "./actionTypes"
export const getDepartments = () => ({
  type: GET_DEPARTMENTS,
})

export const getDepartmentsSuccess = departments => 
  ({
  type: GET_DEPARTMENTS_SUCCESS,
  payload: departments,
})

export const addDepartment = departmentData => ({
  type: ADD_DEPARTMENTS_SUCCESS,
  payload: departmentData,
});

export const updateDepartment = departmentData => ({
  type: UPDATE_DEPARTMENTS_SUCCESS,
  payload: departmentData,
});

export const deleteDepartment = departmentData => ({
  type: DELETE_DEPARTMENTS_SUCCESS,
  payload: departmentData,
});

export const getDepartmentsFail = error => ({
  type: GET_DEPARTMENTS_FAIL,
  payload: error,
})
