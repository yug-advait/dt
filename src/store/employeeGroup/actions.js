import { GET_EMPLOYEEGROUP, ADD_EMPLOYEEGROUP_SUCCESS, GET_EMPLOYEEGROUP_FAIL, GET_EMPLOYEEGROUP_SUCCESS,
  UPDATE_EMPLOYEEGROUP_SUCCESS,DELETE_EMPLOYEEGROUP_SUCCESS
 } from "./actionTypes"
export const getEmployeeGroup = () => ({
  type: GET_EMPLOYEEGROUP,
})

export const getEmployeeGroupSuccess = employeeGroup => 
  ({
  type: GET_EMPLOYEEGROUP_SUCCESS,
  payload: employeeGroup,
})

export const addEmployeeGroup= employeeGroupData => ({
  type: ADD_EMPLOYEEGROUP_SUCCESS,
  payload: employeeGroupData,
});

export const updateEmployeeGroup = employeeGroupData => ({
  type: UPDATE_EMPLOYEEGROUP_SUCCESS,
  payload: employeeGroupData,
});

export const deleteEmployeeGroup = employeeGroupData => ({
  type: DELETE_EMPLOYEEGROUP_SUCCESS,
  payload: employeeGroupData,
});

export const getEmployeeGroupFail = error => ({
  type: GET_EMPLOYEEGROUP_FAIL,
  payload: error,
})
