import {
  GET_VENDORDASHBOARD_SUCCESS,
  GET_VENDORDASHBOARD_FAIL,
  ADD_VENDORDASHBOARD_SUCCESS,
  UPDATE_VENDORDASHBOARD_SUCCESS,
  DELETE_VENDORDASHBOARD_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  vendorDashboard: [],
  error: {},
};
const vendorDashboard = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VENDORDASHBOARD_SUCCESS:
      return {
        ...state,
        listVendorDashboard: true,
        addVendorDashboard: false,
        updateVendorDashboard: false,
        deleteVendorDashboard: false,
        vendorDashboard: action.payload,
      };
    case ADD_VENDORDASHBOARD_SUCCESS:
      return {
        ...state,
        listVendorDashboard: false,
        addVendorDashboard: action.payload,
      };
    case UPDATE_VENDORDASHBOARD_SUCCESS:
      return {
        ...state,
        listVendorDashboard: false,
        updateVendorDashboard: action.payload,
      };
    case DELETE_VENDORDASHBOARD_SUCCESS:
      return {
        ...state,
        listVendorDashboard: false,
        deleteVendorDashboard: action.payload,
      };

    case GET_VENDORDASHBOARD_FAIL:
      return {
        ...state,
        listVendorDashboard: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vendorDashboard;
