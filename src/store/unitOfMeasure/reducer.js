import {
  GET_UNITOFMEASURE_SUCCESS,
  GET_UNITOFMEASURE_FAIL,
  ADD_UNITOFMEASURE_SUCCESS,
  UPDATE_UNITOFMEASURE_SUCCESS,
  DELETE_UNITOFMEASURE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  unitofmeasure: [],
  error: {},
};
const unitOfMeasure = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_UNITOFMEASURE_SUCCESS:
      return {
        ...state,
        listuom:true,
        addunitOfMeasure: false,
        updateunitOfMeasure: false,
        deleteunitOfMeasure: false,
        unitofmeasure: action.payload,
      };
    case ADD_UNITOFMEASURE_SUCCESS:
      return {
        ...state,
        listuom:false,
        addunitOfMeasure: action.payload,
      };
    case UPDATE_UNITOFMEASURE_SUCCESS:
      return {
        ...state,
        listuom:false,
        updateunitOfMeasure: action.payload,
      };
    case DELETE_UNITOFMEASURE_SUCCESS:
      return {
        ...state,
        listuom:false,
        deleteunitOfMeasure: action.payload,
      };

    case GET_UNITOFMEASURE_FAIL:
      return {
        ...state,
        listuom:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default unitOfMeasure;
