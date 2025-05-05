import {
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_FAIL,
  ADD_COUNTRIES_SUCCESS,
  UPDATE_COUNTRIES_SUCCESS,
  DELETE_COUNTRIES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  countries: [],
  error: {},
};

const countries = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        listCountries: true,
        addCountries: false,
        updateCountries: false,
        deleteCountries: false,
        countries: action.payload,
      };
    case ADD_COUNTRIES_SUCCESS:
      return {
        ...state,
        listCountries: false,
        addCountries: action.payload,
      };
    case UPDATE_COUNTRIES_SUCCESS:
      return {
        ...state,
        listCountries: false,
        updateCountries: action.payload,
      };
    case DELETE_COUNTRIES_SUCCESS:
      return {
        ...state,
        listCountries: false,
        deleteCountries: action.payload,
      };

    case GET_COUNTRIES_FAIL:
      return {
        ...state,
        listCountries: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default countries;
