import {
  GET_HSNSAC_SUCCESS,
  GET_HSNSAC_FAIL,
  ADD_HSNSAC_SUCCESS,
  UPDATE_HSNSAC_SUCCESS,
  DELETE_HSNSAC_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  hsnsac: [],
  error: {},
};
const hsnsac = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_HSNSAC_SUCCESS:
      return {
        ...state,
        listhsncode:true,
        addhsnsac: false,
        updatehsnsac: false,
        deletehsnsac: false,
        hsnsac: action.payload,
      };
    case ADD_HSNSAC_SUCCESS:
      return {
        ...state,
        listhsncode:false,
        addhsnsac: action.payload,
      };
    case UPDATE_HSNSAC_SUCCESS:
      return {
        ...state,
        listhsncode:false,
        updatehsnsac: action.payload,
      };
    case DELETE_HSNSAC_SUCCESS:
      return {
        ...state,
        listhsncode:false,
        deletehsnsac: action.payload,
      };

    case GET_HSNSAC_FAIL:
      return {
        ...state,
        listhsncode:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default hsnsac;
