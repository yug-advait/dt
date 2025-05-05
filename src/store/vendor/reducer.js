import {
  GET_VENDOR_SUCCESS,
  GET_VENDOR_FAIL,
  ADD_VENDOR_SUCCESS,
  UPDATE_VENDOR_SUCCESS,
  DELETE_VENDOR_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  vendor: [],
  error: {},
};
const vendor = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VENDOR_SUCCESS:
      return {
        ...state,
        listVendor: true,
        addVendor: false,
        updateVendor: false,
        deleteVendor: false,
        vendor: action.payload,
      };
    case ADD_VENDOR_SUCCESS:
      return {
        ...state,
        listVendor: false,
        addVendor: action.payload,
      };
    case UPDATE_VENDOR_SUCCESS:
      return {
        ...state,
        listVendor: false,
        updateVendor: action.payload,
      };
    case DELETE_VENDOR_SUCCESS:
      return {
        ...state,
        listVendor: false,
        deleteVendor: action.payload,
      };

    case GET_VENDOR_FAIL:
      return {
        ...state,
        listVendor: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vendor;
