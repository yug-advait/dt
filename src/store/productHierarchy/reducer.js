import {
  GET_PRODUCTHIERARCHY_SUCCESS,
  GET_PRODUCTHIERARCHY_FAIL,
  ADD_PRODUCTHIERARCHY_SUCCESS,
  UPDATE_PRODUCTHIERARCHY_SUCCESS,
  DELETE_PRODUCTHIERARCHY_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  producthierarchy: [],
  error: {},
};
const productHierarchy = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTHIERARCHY_SUCCESS:
      return {
        ...state,
        listproductHierarchy:true,
        addproductHierarchy: false,
        updateproductHierarchy: false,
        deleteproductHierarchy: false,
        producthierarchy: action.payload,
      };
    case ADD_PRODUCTHIERARCHY_SUCCESS:
      return {
        ...state,
        listproductHierarchy:false,
        addproductHierarchy: action.payload,
      };
    case UPDATE_PRODUCTHIERARCHY_SUCCESS:
      return {
        ...state,
        listproductHierarchy:false,
        updateproductHierarchy: action.payload,
      };
    case DELETE_PRODUCTHIERARCHY_SUCCESS:
      return {
        ...state,
        listproductHierarchy:false,
        deleteproductHierarchy: action.payload,
      };

    case GET_PRODUCTHIERARCHY_FAIL:
      return {
        ...state,
        listproductHierarchy:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default productHierarchy;
