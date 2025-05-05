import { GET_INCO_TERMS, ADD_INCO_TERMS_SUCCESS, GET_INCO_TERMS_FAIL, GET_INCO_TERMS_SUCCESS,
    UPDATE_INCO_TERMS_SUCCESS,DELETE_INCO_TERMS_SUCCESS
   } from "./actionTypes"
  export const getIncoTerms = (inco_term_type) => ({
    type: GET_INCO_TERMS,
    payload : inco_term_type
  })
  
  export const getIncoTermsSuccess = IncoTerms => 
    ({
    type: GET_INCO_TERMS_SUCCESS,
    payload: IncoTerms,
  })
  
  export const addIncoTerm = IncoTermData => ({
    type: ADD_INCO_TERMS_SUCCESS,
    payload: IncoTermData,
  });
  
  export const updateIncoTerm = IncoTermData => ({
    type: UPDATE_INCO_TERMS_SUCCESS,
    payload: IncoTermData,
  });
  
  export const deleteIncoTerm = IncoTermData => ({
    type: DELETE_INCO_TERMS_SUCCESS,
    payload: IncoTermData,
  });
  
  export const getIncoTermsFail = error => ({
    type: GET_INCO_TERMS_FAIL,
    payload: error,
  })
  