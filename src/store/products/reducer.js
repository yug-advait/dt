import {
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAIL,
  ADD_PRODUCTS_SUCCESS,
  UPDATE_PRODUCTS_SUCCESS,
  DELETE_PRODUCTS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  products: [],
  error: {},
};
const products = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        listproduct: true,
        addproducts: false,
        updateproducts: false,
        deleteproducts: false,
        products: action.payload,
      };
    case ADD_PRODUCTS_SUCCESS:
      return {
        ...state,
        listproduct: false,
        addproducts: action.payload,
      };
    case UPDATE_PRODUCTS_SUCCESS:
      return {
        ...state,
        listproduct: false,
        updateproducts: action.payload,
      };
    case DELETE_PRODUCTS_SUCCESS:
      return {
        ...state,
        listproduct: false,
        deleteproducts: action.payload,
      };

    case GET_PRODUCTS_FAIL:
      return {
        ...state,
        listproduct: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default products;
