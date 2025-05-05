import {
  GET_COSTCENTER_SUCCESS,
  GET_COSTCENTER_FAIL,
  ADD_COSTCENTER_SUCCESS,
  UPDATE_COSTCENTER_SUCCESS,
  DELETE_COSTCENTER_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  costcenter: [],
  error: {},
};

const costcenter = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COSTCENTER_SUCCESS:
      return {
        ...state,
        listCostCenter:true,
        addCostCenter: false,
        updateCostCenter: false,
        deleteCostCenter: false,
        costcenter: action.payload,
      };
    case ADD_COSTCENTER_SUCCESS:
      return {
        ...state,
        listCostCenter:false,
        addCostCenter: action.payload,
      };
    case UPDATE_COSTCENTER_SUCCESS:
      return {
        ...state,
        listCostCenter:false,
        updateCostCenter: action.payload,
      };
    case DELETE_COSTCENTER_SUCCESS:
      return {
        ...state,
        listCostCenter:false,
        deleteCostCenter: action.payload,
      };

    case GET_COSTCENTER_FAIL:
      return {
        ...state,
        listCostCenter:false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default costcenter;
