import {
  GET_ADMINS_SUCCESS,
  GET_ADMINS_FAIL,
  ADD_ADMINS_SUCCESS,
  UPDATE_ADMINS_SUCCESS,
  DELETE_ADMINS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  admins: [],
  error: {},
};
const admins = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADMINS_SUCCESS:
      return {
        ...state,
        listAdmins: true,
        addAdmins: false,
        updateAdmins: false,
        deleteAdmins: false,
        admins: action.payload,
      };
    case ADD_ADMINS_SUCCESS:
      return {
        ...state,
        listAdmins: false,
        addAdmins: action.payload,
      };
    case UPDATE_ADMINS_SUCCESS:
      return {
        ...state,
        listAdmins: false,
        updateAdmins: action.payload,
      };
    case DELETE_ADMINS_SUCCESS:
      return {
        ...state,
        listAdmins: false,
        deleteAdmins: action.payload,
      };

    case GET_ADMINS_FAIL:
      return {
        ...state,
        listAdmins: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default admins;
