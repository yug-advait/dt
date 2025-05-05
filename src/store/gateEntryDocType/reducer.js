import {
  GET_GATEENTRYDOCTYPE_SUCCESS,
  GET_GATEENTRYDOCTYPE_FAIL,
  ADD_GATEENTRYDOCTYPE_SUCCESS,
  UPDATE_GATEENTRYDOCTYPE_SUCCESS,
  DELETE_GATEENTRYDOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  gateEntryDocType: [],
  error: {},
};

const gateEntryDocType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GATEENTRYDOCTYPE_SUCCESS:
      return {
        ...state,
        listGateEntryDocType: true,
        addGateEntryDocType: false,
        updateGateEntryDocType: false,
        deleteGateEntryDocType: false,
        gateEntryDocType: action.payload,
      };
    case ADD_GATEENTRYDOCTYPE_SUCCESS:
      return {
        ...state,
        listGateEntryDocType: false,
        addGateEntryDocType: action.payload,
      };
    case UPDATE_GATEENTRYDOCTYPE_SUCCESS:
      return {
        ...state,
        listGateEntryDocType: false,
        updateGateEntryDocType: action.payload,
      };
    case DELETE_GATEENTRYDOCTYPE_SUCCESS:
      return {
        ...state,
        listGateEntryDocType: false,
        deleteGateEntryDocType: action.payload,
      };

    case GET_GATEENTRYDOCTYPE_FAIL:
      return {
        ...state,
        listGateEntryDocType: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default gateEntryDocType;
