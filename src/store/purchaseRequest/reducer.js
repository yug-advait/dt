import {
  GET_PR_SUCCESS,
  GET_PR_FAIL,
  ADD_PR_SUCCESS,
  UPDATE_PR_SUCCESS,
  DELETE_PR_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  pr: [],
  error: {},
};
const pr = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PR_SUCCESS:
      return {
        ...state,
        listPr: true,
        addPr: false,
        updatePr: false,
        deletePr: false,
        pr: action.payload,
      };
    case ADD_PR_SUCCESS:
      return {
        ...state,
        listPr: false,
        addPr: action.payload,
      };
    case UPDATE_PR_SUCCESS:
      return {
        ...state,
        listPr: false,
        updatePr: action.payload,
      };
    case DELETE_PR_SUCCESS:
      return {
        ...state,
        listPr: false,
        deletePr: action.payload,
      };

    case GET_PR_FAIL:
      return {
        ...state,
        listPr: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default pr;
