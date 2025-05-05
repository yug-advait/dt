import {
  GET_DISTRIBUTION_SUCCESS,
  GET_DISTRIBUTION_FAIL,
  ADD_DISTRIBUTION_SUCCESS,
  UPDATE_DISTRIBUTION_SUCCESS,
  DELETE_DISTRIBUTION_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  distribution: [],
  error: {},
};
const distribution = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        listDistribution: true,
        addDistribution: false,
        updateDistribution: false,
        deleteDistribution: false,
        distribution: action.payload,
      };
    case ADD_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        listDistribution: false,
        addDistribution: action.payload,
      };
    case UPDATE_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        listDistribution: false,
        updateDistribution: action.payload,
      };
    case DELETE_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        listDistribution: false,
        deleteDistribution: action.payload,
      };

    case GET_DISTRIBUTION_FAIL:
      return {
        ...state,
        listDistribution: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default distribution;
