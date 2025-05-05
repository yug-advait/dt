import {
  GET_SALESORGANISATION_SUCCESS,
  GET_SALESORGANISATION_FAIL,
  ADD_SALESORGANISATION_SUCCESS,
  UPDATE_SALESORGANISATION_SUCCESS,
  DELETE_SALESORGANISATION_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  salesorganisation: [],
  error: {},
};

const salesorganisation = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SALESORGANISATION_SUCCESS:
      return {
        ...state,
        listSalesOrganisation: true,
        addSalesOrganisation: false,
        updateSalesOrganisation: false,
        deleteSalesOrganisation: false,
        salesorganisation: action.payload,
      };
    case ADD_SALESORGANISATION_SUCCESS:
      return {
        ...state,
        listSalesOrganisation: false,
        addSalesOrganisation: action.payload,
      };
    case UPDATE_SALESORGANISATION_SUCCESS:
      return {
        ...state,
        listSalesOrganisation: false,
        updateSalesOrganisation: action.payload,
      };
    case DELETE_SALESORGANISATION_SUCCESS:
      return {
        ...state,
        listSalesOrganisation: false,
        deleteSalesOrganisation: action.payload,
      };

    case GET_SALESORGANISATION_FAIL:
      return {
        ...state,
        listSalesOrganisation: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default salesorganisation;
