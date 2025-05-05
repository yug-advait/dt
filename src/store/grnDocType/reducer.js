import {
  GET_GRNDOCTYPE_SUCCESS,
  GET_GRNDOCTYPE_FAIL,
  ADD_GRNDOCTYPE_SUCCESS,
  UPDATE_GRNDOCTYPE_SUCCESS,
  DELETE_GRNDOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  grnDocType: [],
  error: {},
};

const grnDocType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GRNDOCTYPE_SUCCESS:
      return {
        ...state,
        listGrnDoctype: true,
        addGrnDocType: false,
        updateGrnDocType: false,
        deleteGrnDocType: false,
        grnDocType: action.payload,
      };
    case ADD_GRNDOCTYPE_SUCCESS:
      return {
        ...state,
        listGrnDoctype: false,
        addGrnDocType: action.payload,
      };
    case UPDATE_GRNDOCTYPE_SUCCESS:
      return {
        ...state,
        listGrnDoctype: false,
        updateGrnDocType: action.payload,
      };
    case DELETE_GRNDOCTYPE_SUCCESS:
      return {
        ...state,
        listGrnDoctype: false,
        deleteGrnDocType: action.payload,
      };

    case GET_GRNDOCTYPE_FAIL:
      return {
        ...state,
        listGrnDoctype: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default grnDocType;
