import {
  GET_QUALITYCHECK_SUCCESS,
  GET_QUALITYCHECK_FAIL,
  ADD_QUALITYCHECK_SUCCESS,
  UPDATE_QUALITYCHECK_SUCCESS,
  DELETE_QUALITYCHECK_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  qualitycheck: [],
  error: {},
};
const qualitycheck = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_QUALITYCHECK_SUCCESS:
      return {
        ...state,
        listQualityCheck: true,
        addQualityCheck: false,
        updateQualityCheck: false,
        deleteQualityCheck: false,
        qualitycheck: action.payload,
      };
    case ADD_QUALITYCHECK_SUCCESS:
      return {
        ...state,
        listQualityCheck: false,
        addQualityCheck: action.payload,
      };
    case UPDATE_QUALITYCHECK_SUCCESS:
      return {
        ...state,
        listQualityCheck: false,
        updateQualityCheck: action.payload,
      };
    case DELETE_QUALITYCHECK_SUCCESS:
      return {
        ...state,
        listQualityCheck: false,
        deleteQualityCheck: action.payload,
      };

    case GET_QUALITYCHECK_FAIL:
      return {
        ...state,
        listQualityCheck: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default qualitycheck;
