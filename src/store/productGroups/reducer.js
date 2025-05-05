import {
  GET_PRODUCTGROUPS_SUCCESS,
  GET_PRODUCTGROUPS_FAIL,
  ADD_PRODUCTGROUPS_SUCCESS,
  UPDATE_PRODUCTGROUPS_SUCCESS,
  DELETE_PRODUCTGROUPS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  productgroups: [],
  error: {},
};
const productGroups = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTGROUPS_SUCCESS:
      return {
        ...state,
        listproductGroups:true,
        addproductGroups: false,
        updateproductGroups: false,
        deleteproductGroups: false,
        productgroups: action.payload,
      };
    case ADD_PRODUCTGROUPS_SUCCESS:
      return {
        ...state,
         listproductGroups:false,   
        addproductGroups: action.payload,
      };
    case UPDATE_PRODUCTGROUPS_SUCCESS:
      return {
        ...state,
        listproductGroups:false,   
        updateproductGroups: action.payload,
      };
    case DELETE_PRODUCTGROUPS_SUCCESS:
      return {
        ...state,
        listproductGroups:false,   
        deleteproductGroups: action.payload,
      };

    case GET_PRODUCTGROUPS_FAIL:
      return {
        ...state,
        listproductGroups:false,   
        error: action.payload,
      };
    default:
      return state;
  }
};

export default productGroups;
