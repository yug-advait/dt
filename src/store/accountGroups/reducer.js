import {
  GET_ACCOUNTGROUPS_SUCCESS,
  GET_ACCOUNTGROUPS_FAIL,
  ADD_ACCOUNTGROUPS_SUCCESS,
  UPDATE_ACCOUNTGROUPS_SUCCESS,
  DELETE_ACCOUNTGROUPS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  accountGroups: [],
  error: {},
};
const accountGroups = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACCOUNTGROUPS_SUCCESS:
      return {
        ...state,
        listAccountGroups: true,
        addAccountGroups: false,
        updateAccountGroups: false,
        deleteAccountGroups: false,
        accountGroups: action.payload,
      };
    case ADD_ACCOUNTGROUPS_SUCCESS:
      return {
        ...state,
        listAccountGroups: false,
        addAccountGroups: action.payload,
      };
    case UPDATE_ACCOUNTGROUPS_SUCCESS:
      return {
        ...state,
        listAccountGroups: false,
        updateAccountGroups: action.payload,
      };
    case DELETE_ACCOUNTGROUPS_SUCCESS:
      return {
        ...state,
        listAccountGroups: false,
        deleteAccountGroups: action.payload,
      };

    case GET_ACCOUNTGROUPS_FAIL:
      return {
        ...state,
        listAccountGroups: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default accountGroups;
