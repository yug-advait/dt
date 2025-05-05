import {
  GET_RFQ_SUCCESS,
  GET_RFQ_FAIL,
  ADD_RFQ_SUCCESS,
  UPDATE_RFQ_SUCCESS,
  DELETE_RFQ_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  rfq: [],
  error: {},
};
const rfq = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RFQ_SUCCESS:
      return {
        ...state,
        listRfq: true,
        addRfq: false,
        updateRfq: false,
        deleteRfq: false,
        rfq: action.payload,
      };
    case ADD_RFQ_SUCCESS:
      return {
        ...state,
        listRfq: false,
        addRfq: action.payload,
      };
    case UPDATE_RFQ_SUCCESS:
      return {
        ...state,
        listRfq: false,
        updateRfq: action.payload,
      };
    case DELETE_RFQ_SUCCESS:
      return {
        ...state,
        listRfq: false,
        deleteRfq: action.payload,
      };

    case GET_RFQ_FAIL:
      return {
        ...state,
        listRfq: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default rfq;
