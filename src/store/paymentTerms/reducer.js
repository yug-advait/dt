import {
    GET_PAYMENT_TERMS_SUCCESS,
    GET_PAYMENT_TERMS_FAIL,
    ADD_PAYMENT_TERMS_SUCCESS,
    UPDATE_PAYMENT_TERMS_SUCCESS,
    DELETE_PAYMENT_TERMS_SUCCESS,
  } from "./actionTypes";
  
  const INIT_STATE = {
    paymentTerms: [],
    error: {},
  };
  
  const paymentTerms = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PAYMENT_TERMS_SUCCESS:
        return {
          ...state,
          listPaymentTerm: true,
          addPaymentTerm: false,
          updatePaymentTerm: false,
          deletePaymentTerm: false,
          paymentTerms: action.payload,
        };
      case ADD_PAYMENT_TERMS_SUCCESS:
        return {
          ...state,
          listPaymentTerm: false,
          addPaymentTerm: action.payload,
        };
      case UPDATE_PAYMENT_TERMS_SUCCESS:
        return {
          ...state,
          listPaymentTerm: false,
          updatePaymentTerm: action.payload,
        };
      case DELETE_PAYMENT_TERMS_SUCCESS:
        return {
          ...state,
          listPaymentTerm: false,
          deletePaymentTerm: action.payload,
        };
  
      case GET_PAYMENT_TERMS_FAIL:
        return {
          ...state,
          listPaymentTerm: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default paymentTerms;
  