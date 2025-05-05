import {
  GET_TECHNICALPARAMETER_SUCCESS,
  GET_TECHNICALPARAMETER_FAIL,
  ADD_TECHNICALPARAMETER_SUCCESS,
  UPDATE_TECHNICALPARAMETER_SUCCESS,
  DELETE_TECHNICALPARAMETER_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  technicalparameter: [],
  error: {},
};
const technicalparameter = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TECHNICALPARAMETER_SUCCESS:
      return {
        ...state,
        listtetechnicalParameter:true,
        addtechnicalParameter: false,
        updatetechnicalParameter: false,
        deletetechnicalParameter: false,
        technicalparameter: action.payload,
      };
    case ADD_TECHNICALPARAMETER_SUCCESS:
      return {
        ...state,
        listtetechnicalParameter:false,
        addtechnicalParameter: action.payload,
      };
    case UPDATE_TECHNICALPARAMETER_SUCCESS:
      return {
        ...state,
        listtetechnicalParameter:false,
        updatetechnicalParameter: action.payload,
      };
    case DELETE_TECHNICALPARAMETER_SUCCESS:
      return {
        ...state,
        listtetechnicalParameter:false,
        deletetechnicalParameter: action.payload,
      };

    case GET_TECHNICALPARAMETER_FAIL:
      return {
        ...state,
        listtetechnicalParameter:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default technicalparameter;
