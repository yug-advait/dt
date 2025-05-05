import {
  GET_ASN_SUCCESS,
  GET_ASN_FAIL,
  ADD_ASN_SUCCESS,
  UPDATE_ASN_SUCCESS,
  DELETE_ASN_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  asn: [],
  error: {},
};
const asn = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ASN_SUCCESS:
      return {
        ...state,
        listAsn: true,
        addAsn: false,
        updateAsn: false,
        deleteAsn: false,
        asn: action.payload,
      };
    case ADD_ASN_SUCCESS:
      return {
        ...state,
        listAsn: false,
        addAsn: action.payload,
      };
    case UPDATE_ASN_SUCCESS:
      return {
        ...state,
        listAsn: false,
        updateAsn: action.payload,
      };
    case DELETE_ASN_SUCCESS:
      return {
        ...state,
        listAsn: false,
        deleteAsn: action.payload,
      };

    case GET_ASN_FAIL:
      return {
        ...state,
        listAsn: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default asn;
