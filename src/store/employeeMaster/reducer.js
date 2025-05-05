import {
  GET_EMPLOYEEMASTER_SUCCESS,
  GET_EMPLOYEEMASTER_FAIL,
  ADD_EMPLOYEEMASTER_SUCCESS,
  UPDATE_EMPLOYEEMASTER_SUCCESS,
  DELETE_EMPLOYEEMASTER_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  employeemaster: [],
  error: {},
};
const employeeMaster = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEEMASTER_SUCCESS:
      return {
        ...state,
        listEmployee: true,
        addEmployeeMaster: false,
        updateEmployeeMaster: false,
        deleteEmployeeMaster: false,
        employeemaster: action.payload,
      };
    case ADD_EMPLOYEEMASTER_SUCCESS:
      return {
        ...state,
        listEmployee: false,
        addEmployeeMaster: action.payload,
      };
    case UPDATE_EMPLOYEEMASTER_SUCCESS:
      return {
        ...state,
        listEmployee: false,
        updateEmployeeMaster: action.payload,
      };
    case DELETE_EMPLOYEEMASTER_SUCCESS:
      return {
        ...state,
        listEmployee: false,
        deleteEmployeeMaster: action.payload,
      };

    case GET_EMPLOYEEMASTER_FAIL:
      return {
        ...state,
        listEmployee: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default employeeMaster;
