import {
  GET_PRITEM_SUCCESS,
  GET_PRITEM_FAIL,
  ADD_PRITEM_SUCCESS,
  UPDATE_PRITEM_SUCCESS,
  DELETE_PRITEM_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  prItems: [],
  error: {},
};

const prItem = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRITEM_SUCCESS:
      return {
        ...state,
        listPrItem: true,
        addPrItem: false,
        updatePrItem: false,
        deletePrItem: false,
        prItems: action.payload,
      };
    case ADD_PRITEM_SUCCESS:
      return {
        ...state,
        listPrItem: false,
        addPrItem: action.payload,
      };
    case UPDATE_PRITEM_SUCCESS:
      return {
        ...state,
        listPrItem: false,
        updatePrItem: action.payload,
      };
    case DELETE_PRITEM_SUCCESS:
      return {
        ...state,
        listPrItem: false,
        deletePrItem: action.payload,
      };

    case GET_PRITEM_FAIL:
      return {
        ...state,
        listPrItem: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default prItem;
