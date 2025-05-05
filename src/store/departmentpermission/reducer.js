import {
  GET_DEPARTMENTPERMISSION_SUCCESS,
  GET_DEPARTMENTPERMISSION_FAIL,
  ADD_DEPARTMENTPERMISSION_SUCCESS,
  UPDATE_DEPARTMENTPERMISSION_SUCCESS,
  DELETE_DEPARTMENTPERMISSION_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  departmentpermission: [],
  error: {},
};
const departmentpermission = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEPARTMENTPERMISSION_SUCCESS:
      return {
        ...state,
        listDepartmentPermission: true,
        addDepartmentPermission: false,
        updateDepartmentPermission: false,
        deleteDepartmentPermission: false,
        departmentpermission: action.payload,
      };
    case ADD_DEPARTMENTPERMISSION_SUCCESS:
      return {
        ...state,
        listDepartmentPermission: false,
        addDepartmentPermission: action.payload,
      };
    case UPDATE_DEPARTMENTPERMISSION_SUCCESS:
      return {
        ...state,
        listDepartmentPermission: false,
        updateDepartmentPermission: action.payload,
      };
    case DELETE_DEPARTMENTPERMISSION_SUCCESS:
      return {
        ...state,
        listDepartmentPermission: false,
        deleteDepartmentPermission: action.payload,
      };

    case GET_DEPARTMENTPERMISSION_FAIL:
      return {
        ...state,
        listDepartmentPermission: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default departmentpermission;
