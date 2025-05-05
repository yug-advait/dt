import {
  GET_RFQDOCTYPE_SUCCESS,
  GET_RFQDOCTYPE_FAIL,
  ADD_RFQDOCTYPE_SUCCESS,
  UPDATE_RFQDOCTYPE_SUCCESS,
  DELETE_RFQDOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  rfqDocType: [],
  error: {},
};

const rfqDocType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RFQDOCTYPE_SUCCESS:
      return {
        ...state,
        listRfqDoctype: true,
        addRfqDocType: false,
        updateRfqDocType: false,
        deleteRfqDocType: false,
        rfqDocType: action.payload,
      };
    case ADD_RFQDOCTYPE_SUCCESS:
      return {
        ...state,
        listRfqDoctype: false,
        addRfqDocType: action.payload,
      };
    case UPDATE_RFQDOCTYPE_SUCCESS:
      return {
        ...state,
        listRfqDoctype: false,
        updateRfqDocType: action.payload,
      };
    case DELETE_RFQDOCTYPE_SUCCESS:
      return {
        ...state,
        listRfqDoctype: false,
        deleteRfqDocType: action.payload,
      };

    case GET_RFQDOCTYPE_FAIL:
      return {
        ...state,
        listRfqDoctype: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default rfqDocType;
