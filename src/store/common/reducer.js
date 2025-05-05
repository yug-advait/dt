import {
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_RESET,
  GET_COMMON_FAIL
} from "./actionTypes";

const INIT_STATE = {
  error: {},
};

const commons = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        updateCommon: action.payload,
      };
    case UPDATE_STATUS_RESET:
      return {
        ...state,
        updateCommon: false,
      };
    case GET_COMMON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default commons;
