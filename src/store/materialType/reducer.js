import {
  GET_MATERIALTYPE_SUCCESS,
  GET_MATERIALTYPE_FAIL,
  ADD_MATERIALTYPE_SUCCESS,
  UPDATE_MATERIALTYPE_SUCCESS,
  DELETE_MATERIALTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  materialtype: [],
  error: {},
};
const materialType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MATERIALTYPE_SUCCESS:
      return {
        ...state,
        listmaterialType:true,
        addmaterialType: false,
        updatematerialType: false,
        deletematerialType: false,
        materialtype: action.payload,
      };
    case ADD_MATERIALTYPE_SUCCESS:
      return {
        ...state,
        listmaterialType:false,
        addmaterialType: action.payload,
      };
    case UPDATE_MATERIALTYPE_SUCCESS:
      return {
        ...state,
        listmaterialType:false,
        updatematerialType: action.payload,
      };
    case DELETE_MATERIALTYPE_SUCCESS:
      return {
        ...state,
        listmaterialType:false,
        deletematerialType: action.payload,
      };

    case GET_MATERIALTYPE_FAIL:
      return {
        ...state,
        listmaterialType:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default materialType;
