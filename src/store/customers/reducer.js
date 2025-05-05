import {
  GET_CUSTOMERS_SUCCESS,
  GET_CUSTOMERS_FAIL,
  ADD_CUSTOMERS_SUCCESS,
  UPDATE_CUSTOMERS_SUCCESS,
  DELETE_CUSTOMERS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  customers: [],
  error: {},
};
const customers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        listCustomer: true,
        addcustomers: false,
        updatecustomers: false,
        deletecustomers: false,
        customers: action.payload,
      };
    case ADD_CUSTOMERS_SUCCESS:
      return {
        ...state,
        listCustomer: false,
        addcustomers: action.payload,
      };
    case UPDATE_CUSTOMERS_SUCCESS:
      return {
        ...state,
        listCustomer: false,
        updatecustomers: action.payload,
      };
    case DELETE_CUSTOMERS_SUCCESS:
      return {
        ...state,
        listCustomer: false,
        deletecustomers: action.payload,
      };

    case GET_CUSTOMERS_FAIL:
      return {
        ...state,
        listCustomer: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default customers;
