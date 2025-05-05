import {
  GET_GOODRECEIPT_SUCCESS,
  GET_GOODRECEIPT_FAIL,
  ADD_GOODRECEIPT_SUCCESS,
  UPDATE_GOODRECEIPT_SUCCESS,
  DELETE_GOODRECEIPT_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  goodreceipt: [],
  error: {},
};
const goodreceipt = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GOODRECEIPT_SUCCESS:
      return {
        ...state,
        listGoodReceipt: true,
        addGoodReceipt: false,
        updateGoodReceipt: false,
        deleteGoodReceipt: false,
        goodreceipt: action.payload,
      };
    case ADD_GOODRECEIPT_SUCCESS:
      return {
        ...state,
        listGoodReceipt: false,
        addGoodReceipt: action.payload,
      };
    case UPDATE_GOODRECEIPT_SUCCESS:
      return {
        ...state,
        listGoodReceipt: false,
        updateGoodReceipt: action.payload,
      };
    case DELETE_GOODRECEIPT_SUCCESS:
      return {
        ...state,
        listGoodReceipt: false,
        deleteGoodReceipt: action.payload,
      };

    case GET_GOODRECEIPT_FAIL:
      return {
        ...state,
        listGoodReceipt: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default goodreceipt;
