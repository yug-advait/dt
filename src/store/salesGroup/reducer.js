import {
  GET_SALESGROUP_SUCCESS,
  GET_SALESGROUP_FAIL,
  ADD_SALESGROUP_SUCCESS,
  UPDATE_SALESGROUP_SUCCESS,
  DELETE_SALESGROUP_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  salesgroup: [],
  error: {},
};
const salesgroup = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SALESGROUP_SUCCESS:
      return {
        ...state,
        listSalesGroup: true,
        addSalesGroup: false,
        updateSalesGroup: false,
        deleteSalesGroup: false,
        salesgroup: action.payload,
      };
    case ADD_SALESGROUP_SUCCESS:
      return {
        ...state,
        listSalesGroup: false,
        addSalesGroup: action.payload,
      };
    case UPDATE_SALESGROUP_SUCCESS:
      return {
        ...state,
        listSalesGroup: false,
        updateSalesGroup: action.payload,
      };
    case DELETE_SALESGROUP_SUCCESS:
      return {
        ...state,
        listSalesGroup: false,
        deleteSalesGroup: action.payload,
      };

    case GET_SALESGROUP_FAIL:
      return {
        ...state,
        listSalesGroup: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default salesgroup;
