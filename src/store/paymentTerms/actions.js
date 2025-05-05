import { GET_PAYMENT_TERMS, ADD_PAYMENT_TERMS_SUCCESS, GET_PAYMENT_TERMS_FAIL, GET_PAYMENT_TERMS_SUCCESS,
    UPDATE_PAYMENT_TERMS_SUCCESS,DELETE_PAYMENT_TERMS_SUCCESS
   } from "./actionTypes"
  export const getPaymentTerms = () => ({
    type: GET_PAYMENT_TERMS,
  })
  
  export const getPaymentTermsSuccess = paymentTerms => 
    ({
    type: GET_PAYMENT_TERMS_SUCCESS,
    payload: paymentTerms,
  })
  
  export const addPaymentTerm = paymentTermData => ({
    type: ADD_PAYMENT_TERMS_SUCCESS,
    payload: paymentTermData,
  });
  
  export const updatePaymentTerm = paymentTermData => ({
    type: UPDATE_PAYMENT_TERMS_SUCCESS,
    payload: paymentTermData,
  });
  
  export const deletePaymentTerm = paymentTermData => ({
    type: DELETE_PAYMENT_TERMS_SUCCESS,
    payload: paymentTermData,
  });
  
  export const getPaymentTermsFail = error => ({
    type: GET_PAYMENT_TERMS_FAIL,
    payload: error,
  })
  