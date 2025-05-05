import {
  GET_CURRENCYCONVERSIONS_SUCCESS,
  GET_CURRENCYCONVERSIONS_FAIL,
  ADD_CURRENCYCONVERSIONS_SUCCESS,
  UPDATE_CURRENCYCONVERSIONS_SUCCESS,
  DELETE_CURRENCYCONVERSIONS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  currencyConversions: [],
  error: {},
};
const currencyConversions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CURRENCYCONVERSIONS_SUCCESS:
      return {
        ...state,
        addCurrencyConversions: false,
        listCurrencyConversions: true,
        updateCurrencyConversions: false,
        deleteCurrencyConversions: false,
        currencyConversions: action.payload,
      };
    case ADD_CURRENCYCONVERSIONS_SUCCESS:
      return {
        ...state,
        listCurrencyConversions: false,
        addCurrencyConversions: action.payload,
      };
    case UPDATE_CURRENCYCONVERSIONS_SUCCESS:
      return {
        ...state,
        listCurrencyConversions: false,
        updateCurrencyConversions: action.payload,
      };
    case DELETE_CURRENCYCONVERSIONS_SUCCESS:
      return {
        ...state,
        listCurrencyConversions: false,
        deleteCurrencyConversions: action.payload,
      };

    case GET_CURRENCYCONVERSIONS_FAIL:
      return {
        ...state,
        listCurrencyConversions: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default currencyConversions;
