import { GET_EMPLOYEEMASTER, ADD_EMPLOYEEMASTER_SUCCESS, GET_EMPLOYEEMASTER_FAIL, GET_EMPLOYEEMASTER_SUCCESS,
  UPDATE_EMPLOYEEMASTER_SUCCESS,DELETE_EMPLOYEEMASTER_SUCCESS
 } from "./actionTypes"
export const getEmployeeMaster = () => ({
  type: GET_EMPLOYEEMASTER,
})

export const getEmployeeMasterSuccess = EmployeeMaster => ({
  type: GET_EMPLOYEEMASTER_SUCCESS,
  payload: EmployeeMaster,
})

export const addEmployeeMaster= EmployeeMasterData => ({
  type: ADD_EMPLOYEEMASTER_SUCCESS,
  payload: EmployeeMasterData,
});

export const updateEmployeeMaster = EmployeeMasterData => ({
  type: UPDATE_EMPLOYEEMASTER_SUCCESS,
  payload: EmployeeMasterData,
});

export const deleteEmployeeMaster = EmployeeMasterData => ({
  type: DELETE_EMPLOYEEMASTER_SUCCESS,
  payload: EmployeeMasterData,
});

export const getEmployeeMasterFail = error => ({
  type: GET_EMPLOYEEMASTER_FAIL,
  payload: error,
})
