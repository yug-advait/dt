import {
  GET_MATERIALGROUP_SUCCESS,
  GET_MATERIALGROUP_FAIL,
  ADD_MATERIALGROUP_SUCCESS,
  UPDATE_MATERIALGROUP_SUCCESS,
  DELETE_MATERIALGROUP_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  materialgroup: [],
  error: {},
};
const materialGroup = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MATERIALGROUP_SUCCESS:
      return {
        ...state,
        listmaterialGroup:true,
        addmaterialGroup: false,
        updatematerialGroup: false,
        deletematerialGroup: false,
        materialgroup: action.payload,
      };
    case ADD_MATERIALGROUP_SUCCESS:
      return {
        ...state,
        listmaterialGroup:false,
        addmaterialGroup: action.payload,
      };
    case UPDATE_MATERIALGROUP_SUCCESS:
      return {
        ...state,
        listmaterialGroup:false,
        updatematerialGroup: action.payload,
      };
    case DELETE_MATERIALGROUP_SUCCESS:
      return {
        ...state,
        listmaterialGroup:false,
        deletematerialGroup: action.payload,
      };

    case GET_MATERIALGROUP_FAIL:
      return {
        ...state,
        listmaterialGroup:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default materialGroup;
