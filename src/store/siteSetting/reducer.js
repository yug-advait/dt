import {
  GET_SITESETTING_SUCCESS,
  GET_SITESETTING_FAIL,
  ADD_SITESETTING_SUCCESS,
  UPDATE_SITESETTING_SUCCESS,
  DELETE_SITESETTING_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  siteSetting: [],
  error: {},
};
const siteSetting = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SITESETTING_SUCCESS:
      return {
        ...state,
        addsiteSetting: false,
        updatesiteSetting: false,
        deletesiteSetting: false,
        siteSetting: action.payload,
      };
    case ADD_SITESETTING_SUCCESS:
      return {
        ...state,
        addsiteSetting: action.payload,
      };
    case UPDATE_SITESETTING_SUCCESS:
      return {
        ...state,
        updatesiteSetting: action.payload,
      };
    case DELETE_SITESETTING_SUCCESS:
      return {
        ...state,
        deletesiteSetting: action.payload,
      };

    case GET_SITESETTING_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default siteSetting;
