import {
  GET_TAXINDICATOR_SUCCESS,
  GET_TAXINDICATOR_FAIL,
  ADD_TAXINDICATOR_SUCCESS,
  UPDATE_TAXINDICATOR_SUCCESS,
  DELETE_TAXINDICATOR_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  taxIndicator: [],
  error: {},
};
const taxIndicator = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TAXINDICATOR_SUCCESS:
      return {
        ...state,
        listTaxIndicator: true,
        addTaxIndicator: false,
        updateTaxIndicator: false,
        deleteTaxIndicator: false,
        taxIndicator: action.payload,
      };
    case ADD_TAXINDICATOR_SUCCESS:
      return {
        ...state,
        listTaxIndicator: false,
        addTaxIndicator: action.payload,
      };
    case UPDATE_TAXINDICATOR_SUCCESS:
      return {
        ...state,
        listTaxIndicator: false,
        updateTaxIndicator: action.payload,
      };
    case DELETE_TAXINDICATOR_SUCCESS:
      return {
        ...state,
        listTaxIndicator: false,
        deleteTaxIndicator: action.payload,
      };

    case GET_TAXINDICATOR_FAIL:
      return {
        ...state,
        listTaxIndicator: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default taxIndicator;
