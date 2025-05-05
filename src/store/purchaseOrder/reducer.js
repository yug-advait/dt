import {
  GET_PO_SUCCESS,
  GET_PO_FAIL,
  ADD_PO_SUCCESS,
  UPDATE_PO_SUCCESS,
  DELETE_PO_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  po: [],
  error: {},
};
const po = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PO_SUCCESS:
      return {
        ...state,
        listPo: true,
        addPo: false,
        updatePo: false,
        deletePo: false,
        po: action.payload,
      };
    case ADD_PO_SUCCESS:
      return {
        ...state,
        listPo: false,
        addPo: action.payload,
      };
    case UPDATE_PO_SUCCESS:
      return {
        ...state,
        listPo: false,
        updatePo: action.payload,
      };
    case DELETE_PO_SUCCESS:
      return {
        ...state,
        listPo: false,
        deletePo: action.payload,
      };

    case GET_PO_FAIL:
      return {
        ...state,
        listPo: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default po;
