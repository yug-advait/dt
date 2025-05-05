import {
  GET_CUSTOMERGROUPS_SUCCESS,
  GET_CUSTOMERGROUPS_FAIL,
  ADD_CUSTOMERGROUPS_SUCCESS,
  UPDATE_CUSTOMERGROUPS_SUCCESS,
  DELETE_CUSTOMERGROUPS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  customerGroups: [],
  error: {},
};
const customerGroups = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOMERGROUPS_SUCCESS:
      return {
        ...state,
        listCustomerGroups: true,
        addCustomerGroups: false,
        updateCustomerGroups: false,
        deleteCustomerGroups: false,
        customerGroups: action.payload,
      };
    case ADD_CUSTOMERGROUPS_SUCCESS:
      return {
        ...state,
        listCustomerGroups: false,
        addCustomerGroups: action.payload,
      };
    case UPDATE_CUSTOMERGROUPS_SUCCESS:
      return {
        ...state,
        listCustomerGroups: false,
        updateCustomerGroups: action.payload,
      };
    case DELETE_CUSTOMERGROUPS_SUCCESS:
      return {
        ...state,
        listCustomerGroups: false,
        deleteCustomerGroups: action.payload,
      };

    case GET_CUSTOMERGROUPS_FAIL:
      return {
        ...state,
        listCustomerGroups: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default customerGroups;
