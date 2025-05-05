import {
  GET_ASNDOCTYPE_SUCCESS,
  GET_ASNDOCTYPE_FAIL,
  ADD_ASNDOCTYPE_SUCCESS,
  UPDATE_ASNDOCTYPE_SUCCESS,
  DELETE_ASNDOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  asnDocType: [],
  error: {},
};

const asnDocType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ASNDOCTYPE_SUCCESS:
      return {
        ...state,
        listAsnDoctype: true,
        addAsnDocType: false,
        updateAsnDocType: false,
        deleteAsnDocType: false,
        asnDocType: action.payload,
      };
    case ADD_ASNDOCTYPE_SUCCESS:
      return {
        ...state,
        listAsnDoctype: false,
        addAsnDocType: action.payload,
      };
    case UPDATE_ASNDOCTYPE_SUCCESS:
      return {
        ...state,
        listAsnDoctype: false,
        updateAsnDocType: action.payload,
      };
    case DELETE_ASNDOCTYPE_SUCCESS:
      return {
        ...state,
        listAsnDoctype: false,
        deleteAsnDocType: action.payload,
      };

    case GET_ASNDOCTYPE_FAIL:
      return {
        ...state,
        listAsnDoctype: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default asnDocType;
