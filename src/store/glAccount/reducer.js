import {
  GET_GLACCOUNT_SUCCESS,
  GET_GLACCOUNT_FAIL,
  ADD_GLACCOUNT_SUCCESS,
  UPDATE_GLACCOUNT_SUCCESS,
  DELETE_GLACCOUNT_SUCCESS, 
} from "./actionTypes";

const INIT_STATE = {
  glaccount: [],
  error: {},
};
const glaccount = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GLACCOUNT_SUCCESS:
      return {
        ...state,
        listGLAAccount:true,
        addGLAccount: false,
        updateGLAccount: false,
        deleteGLAccount: false,
        glaccount: action.payload,
      };
    case ADD_GLACCOUNT_SUCCESS:
      return {
        ...state,
        listGLAAccount:false,
        addGLAccount: action.payload,
      };
    case UPDATE_GLACCOUNT_SUCCESS:
      return {
        ...state,
        listGLAAccount:false,
        updateGLAccount: action.payload,
      };
    case DELETE_GLACCOUNT_SUCCESS:
      return {
        ...state,
        listGLAAccount:false,
        deleteGLAccount: action.payload,
      };

    case GET_GLACCOUNT_FAIL:
      return {
        ...state,
        listGLAAccount:false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default glaccount;
