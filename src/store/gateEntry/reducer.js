import {
  GET_GATEENTRY_SUCCESS,
  GET_GATEENTRY_FAIL,
  ADD_GATEENTRY_SUCCESS,
  UPDATE_GATEENTRY_SUCCESS,
  DELETE_GATEENTRY_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  gateEntry: [],
  error: {},
};
const gateEntry = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GATEENTRY_SUCCESS:
      return {
        ...state,
        listGateEntry: true,
        addGateEntry: false,
        updateGateEntry: false,
        deleteGateEntry: false,
        gateEntry: action.payload,
      };
    case ADD_GATEENTRY_SUCCESS:
      return {
        ...state,
        listGateEntry: false,
        addGateEntry: action.payload,
      };
    case UPDATE_GATEENTRY_SUCCESS:
      return {
        ...state,
        listGateEntry: false,
        updateGateEntry: action.payload,
      };
    case DELETE_GATEENTRY_SUCCESS:
      return {
        ...state,
        listGateEntry: false,
        deleteGateEntry: action.payload,
      };

    case GET_GATEENTRY_FAIL:
      return {
        ...state,
        listGateEntry: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default gateEntry;
