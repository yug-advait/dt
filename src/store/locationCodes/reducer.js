import {
  GET_LOCATIONCODES_SUCCESS,
  GET_LOCATIONCODES_FAIL,
  ADD_LOCATIONCODES_SUCCESS,
  UPDATE_LOCATIONCODES_SUCCESS,
  DELETE_LOCATIONCODES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  locationCodes: [],
  error: {},
};
const locationCodes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LOCATIONCODES_SUCCESS:
      return {
        ...state,
        listLocationCodes: true,
        addLocationCodes: false,
        updateLocationCodes: false,
        deleteLocationCodes: false,
        locationCodes: action.payload,
      };
    case ADD_LOCATIONCODES_SUCCESS:
      return {
        ...state,
        listLocationCodes: false,
        addLocationCodes: action.payload,
      };
    case UPDATE_LOCATIONCODES_SUCCESS:
      return {
        ...state,
        listLocationCodes: false,
        updateLocationCodes: action.payload,
      };
    case DELETE_LOCATIONCODES_SUCCESS:
      return {
        ...state,
        listLocationCodes: false,
        deleteLocationCodes: action.payload,
      };

    case GET_LOCATIONCODES_FAIL:
      return {
        ...state,
        listLocationCodes: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default locationCodes;
