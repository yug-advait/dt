import {
  GET_TECHSET_SUCCESS,
  GET_TECHSET_FAIL,
  ADD_TECHSET_SUCCESS,
  UPDATE_TECHSET_SUCCESS,
  DELETE_TECHSET_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  techset: [],
  error: {},
};
const techset = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TECHSET_SUCCESS:
      return {
        ...state,
        listtechSet:true,
        addtechSet: false,
        updatetechSet: false,
        deletetechSet: false,
        techset: action.payload,
      };
    case ADD_TECHSET_SUCCESS:
      return {
        ...state,
        listtechSet:false,
        addtechSet: action.payload,
      };
    case UPDATE_TECHSET_SUCCESS:
      return {
        ...state,
        listtechSet:false,
        updatetechSet: action.payload,
      };
    case DELETE_TECHSET_SUCCESS:
      return {
        ...state,
        listtechSet:false,
        deletetechSet: action.payload,
      };

    case GET_TECHSET_FAIL:
      return {
        ...state,
        listtechSet:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default techset;
