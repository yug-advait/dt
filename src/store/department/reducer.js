import {
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_FAIL,
  ADD_DEPARTMENTS_SUCCESS,
  UPDATE_DEPARTMENTS_SUCCESS,
  DELETE_DEPARTMENTS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  departments: [],
  error: {},
};

const departments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        listDepartment: true,
        addDepartment: false,
        updateDepartment: false,
        deleteDepartment: false,
        departments: action.payload,
      };
    case ADD_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        listDepartment: false,
        addDepartment: action.payload,
      };
    case UPDATE_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        listDepartment: false,
        updateDepartment: action.payload,
      };
    case DELETE_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        listDepartment: false,
        deleteDepartment: action.payload,
      };

    case GET_DEPARTMENTS_FAIL:
      return {
        ...state,
        listDepartment: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default departments;
