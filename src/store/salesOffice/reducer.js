import {
  GET_SALESOFFICE_SUCCESS,
  GET_SALESOFFICE_FAIL,
  ADD_SALESOFFICE_SUCCESS,
  UPDATE_SALESOFFICE_SUCCESS,
  DELETE_SALESOFFICE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  salesOffice: [],
  error: {},
};

const salesOffice = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SALESOFFICE_SUCCESS:
      return {
        ...state,
        listSalesOffice :true,
        addSalesOffice: false,
        updateSalesOffice: false,
        deleteSalesOffice: false,
        salesOffice: action.payload,
      };
    case ADD_SALESOFFICE_SUCCESS:
      return {
        ...state,
        listSalesOffice :false,
        addSalesOffice: action.payload,
      };
    case UPDATE_SALESOFFICE_SUCCESS:
      return {
        ...state,
        listSalesOffice :false,
        updateSalesOffice: action.payload,
      };
    case DELETE_SALESOFFICE_SUCCESS:
      return {
        ...state,
        listSalesOffice :false,
        deleteSalesOffice: action.payload,
      };

    case GET_SALESOFFICE_FAIL:
      return {
        ...state,
        listSalesOffice :false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default salesOffice;
