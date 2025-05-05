import {
  GET_VENDORGROUPS_SUCCESS,
  GET_VENDORGROUPS_FAIL,
  ADD_VENDORGROUPS_SUCCESS,
  UPDATE_VENDORGROUPS_SUCCESS,
  DELETE_VENDORGROUPS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  vendorGroups: [],
  error: {},
};
const VendorGroups = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VENDORGROUPS_SUCCESS:
      return {
        ...state,
        listVendorGroups: true,
        addVendorGroups: false,
        updateVendorGroups: false,
        deleteVendorGroups: false,
        vendorGroups: action.payload,
      };
    case ADD_VENDORGROUPS_SUCCESS:
      return {
        ...state,
        listVendorGroups: false,
        addVendorGroups: action.payload,
      };
    case UPDATE_VENDORGROUPS_SUCCESS:
      return {
        ...state,
        listVendorGroups: false,
        updateVendorGroups: action.payload,
      };
    case DELETE_VENDORGROUPS_SUCCESS:
      return {
        ...state,
        listVendorGroups: false,
        deleteVendorGroups: action.payload,
      };

    case GET_VENDORGROUPS_FAIL:
      return {
        ...state,
        listVendorGroups: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default VendorGroups;
