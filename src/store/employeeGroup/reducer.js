import {
  GET_EMPLOYEEGROUP_SUCCESS,
  GET_EMPLOYEEGROUP_FAIL,
  ADD_EMPLOYEEGROUP_SUCCESS,
  UPDATE_EMPLOYEEGROUP_SUCCESS,
  DELETE_EMPLOYEEGROUP_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  employeeGroup: [],
  error: {},
};
const employeeGroup = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEEGROUP_SUCCESS:
      return {
        ...state,
        listEmployeeGroup: true,
        addEmployeeGroup: false,
        updateEmployeeGroup: false,
        deleteEmployeeGroup: false,
        employeeGroup: action.payload,
      };
    case ADD_EMPLOYEEGROUP_SUCCESS:
      return {
        ...state,
        listEmployeeGroup: false,
        addEmployeeGroup: action.payload,
      };
    case UPDATE_EMPLOYEEGROUP_SUCCESS:
      return {
        ...state,
        listEmployeeGroup: false,
        updateEmployeeGroup: action.payload,
      };
    case DELETE_EMPLOYEEGROUP_SUCCESS:
      return {
        ...state,
        listEmployeeGroup: false,
        deleteEmployeeGroup: action.payload,
      };

    case GET_EMPLOYEEGROUP_FAIL:
      return {
        ...state,
        listEmployeeGroup: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default employeeGroup;
