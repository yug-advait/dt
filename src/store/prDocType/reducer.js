import {
  GET_PRDOCTYPE_SUCCESS,
  GET_PRDOCTYPE_FAIL,
  ADD_PRDOCTYPE_SUCCESS,
  UPDATE_PRDOCTYPE_SUCCESS,
  DELETE_PRDOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  prDocType: [],
  error: {},
};

const prDocType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRDOCTYPE_SUCCESS:
      return {
        ...state,
        listPrDocType: true,
        addPrDocType: false,
        updatePrDocType: false,
        deletePrDocType: false,
        prDocType: action.payload,
      };
    case ADD_PRDOCTYPE_SUCCESS:
      return {
        ...state,
        listPrDocType: false,
        addPrDocType: action.payload,
      };
    case UPDATE_PRDOCTYPE_SUCCESS:
      return {
        ...state,
        listPrDocType: false,
        updatePrDocType: action.payload,
      };
    case DELETE_PRDOCTYPE_SUCCESS:
      return {
        ...state,
        listPrDocType: false,
        deletePrDocType: action.payload,
      };

    case GET_PRDOCTYPE_FAIL:
      return {
        ...state,
        listPrDocType: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default prDocType;
