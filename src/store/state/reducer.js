import {
  GET_STATES_SUCCESS,
  GET_STATES_FAIL,
  ADD_STATES_SUCCESS,
  UPDATE_STATES_SUCCESS,
  DELETE_STATES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  states: [],
  error: {},
};

const states = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STATES_SUCCESS:
      return {
        ...state,
        listStates: true,
        addStates: false,
        updateStates: false,
        deleteStates: false,
        states: action.payload,
      };
    case ADD_STATES_SUCCESS:
      return {
        ...state,
        listStates: false,
        addStates: action.payload,
      };
    case UPDATE_STATES_SUCCESS:
      return {
        ...state,
        listStates: false,
        updateStates: action.payload,
      };
    case DELETE_STATES_SUCCESS:
      return {
        ...state,
        listStates: false,
        deleteStates: action.payload,
      };

    case GET_STATES_FAIL:
      return {
        ...state,
        listStates: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default states;
