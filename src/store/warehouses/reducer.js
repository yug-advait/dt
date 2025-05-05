import {
  GET_WAREHOUSES_SUCCESS,
  GET_WAREHOUSES_FAIL,
  ADD_WAREHOUSES_SUCCESS,
  UPDATE_WAREHOUSES_SUCCESS,
  DELETE_WAREHOUSES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  warehouses: [],
  error: {},
};
const warehouses = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WAREHOUSES_SUCCESS:
      return {
        ...state,
        listWarehouses:true,
        addWarehouses: false,
        updateWarehouses: false,
        deleteWarehouses: false,
        warehouses: action.payload,
      };
    case ADD_WAREHOUSES_SUCCESS:
      return {
        ...state,
        listWarehouses:false,
        addWarehouses: action.payload,
      };
    case UPDATE_WAREHOUSES_SUCCESS:
      return {
        ...state,
        listWarehouses:false,
        updateWarehouses: action.payload,
      };
    case DELETE_WAREHOUSES_SUCCESS:
      return {
        ...state,
        listWarehouses:false,
        deleteWarehouses: action.payload,
      };

    case GET_WAREHOUSES_FAIL:
      return {
        ...state,
        listWarehouses:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default warehouses;
