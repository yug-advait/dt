import {
  GET_CURRENCY_SUCCESS,
  GET_CURRENCY_FAIL,
  ADD_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_SUCCESS,
  DELETE_CURRENCY_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  currency: [],
  error: {},
};
const currency = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CURRENCY_SUCCESS:
      return {
        ...state,
        listCurrency: true,
        addCurrency: false,
        updateCurrency: false,
        deleteCurrency: false,
        currency: action.payload,
      };
    case ADD_CURRENCY_SUCCESS:
      return {
        ...state,
        listCurrency: false,
        addCurrency: action.payload,
      };
    case UPDATE_CURRENCY_SUCCESS:
      return {
        ...state,
        listCurrency: false,
        updateCurrency: action.payload,
      };
    case DELETE_CURRENCY_SUCCESS:
      return {
        ...state,
        listCurrency: false,
        deleteCurrency: action.payload,
      };

    case GET_CURRENCY_FAIL:
      return {
        ...state,
        listCurrency: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default currency;
