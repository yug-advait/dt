import {
  GET_CITIES_SUCCESS,
  GET_CITIES_FAIL,
  ADD_CITIES_SUCCESS,
  UPDATE_CITIES_SUCCESS,
  DELETE_CITIES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  cities: [],
  error: {},
};

const cities = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        addCities: false,
        updateCities: false,
        deleteCities: false,
        cities: action.payload,
      };
    case ADD_CITIES_SUCCESS:
      return {
        ...state,
        addCities: action.payload,
      };
    case UPDATE_CITIES_SUCCESS:
      return {
        ...state,
        updateCities: action.payload,
      };
    case DELETE_CITIES_SUCCESS:
      return {
        ...state,
        deleteCities: action.payload,
      };

    case GET_CITIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default cities;
