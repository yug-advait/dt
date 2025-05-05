import {
  GET_ADMINGROUPS_SUCCESS,
  GET_ADMINGROUPS_FAIL,
  ADD_ADMINGROUPS_SUCCESS,
  UPDATE_ADMINGROUPS_SUCCESS,
  DELETE_ADMINGROUPS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  admingroups: [],
  error: {},
};
const admingroups = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADMINGROUPS_SUCCESS:
      return {
        ...state,
        listAdminGroups:true,
        addAdminGroups: false,
        updateAdminGroups: false,
        deleteAdminGroups: false,
        admingroups: action.payload,
      };
    case ADD_ADMINGROUPS_SUCCESS:
      return {
        ...state,
        listAdminGroups:false,
        addAdminGroups: action.payload,
      };
    case UPDATE_ADMINGROUPS_SUCCESS:
      return {
        ...state,
        listAdminGroups:false,
        updateAdminGroups: action.payload,
      };
    case DELETE_ADMINGROUPS_SUCCESS:
      return {
        ...state,
        listAdminGroups:false,
        deleteAdminGroups: action.payload,
      };

    case GET_ADMINGROUPS_FAIL:
      return {
        ...state,
        listAdminGroups:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default admingroups;
