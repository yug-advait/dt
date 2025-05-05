import {
  GET_PODOCTYPE_SUCCESS,
  GET_PODOCTYPE_FAIL,
  ADD_PODOCTYPE_SUCCESS,
  UPDATE_PODOCTYPE_SUCCESS,
  DELETE_PODOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  poDocType: [],
  error: {},
};

const poDocType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PODOCTYPE_SUCCESS:
      return {
        ...state,
        listPoDocType: true,
        addPoDocType: false,
        updatePoDocType: false,
        deletePoDocType: false,
        poDocType: action.payload,
      };
    case ADD_PODOCTYPE_SUCCESS:
      return {
        ...state,
        listPoDocType: false,
        addPoDocType: action.payload,
      };
    case UPDATE_PODOCTYPE_SUCCESS:
      return {
        ...state,
        listPoDocType: false,
        updatePoDocType: action.payload,
      };
    case DELETE_PODOCTYPE_SUCCESS:
      return {
        ...state,
        listPoDocType: false,
        deletePoDocType: action.payload,
      };

    case GET_PODOCTYPE_FAIL:
      return {
        ...state,
        listPoDocType: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default poDocType;
