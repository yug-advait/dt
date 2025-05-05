import {
    GET_INCO_TERMS_SUCCESS,
    GET_INCO_TERMS_FAIL,
    ADD_INCO_TERMS_SUCCESS,
    UPDATE_INCO_TERMS_SUCCESS,
    DELETE_INCO_TERMS_SUCCESS,
  } from "./actionTypes";
  
  const INIT_STATE = {
    incoTerms: [],
    error: {},
  };
  
  const incoTerms = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_INCO_TERMS_SUCCESS:
        return {
          ...state,
          listIncoTerm: true,
          addIncoTerm: false,
          updateIncoTerm: false,
          deleteIncoTerm: false,
          incoTerms: action.payload,
        };
      case ADD_INCO_TERMS_SUCCESS:
        return {
          ...state,
          listIncoTerm: false,
          addIncoTerm: action.payload,
        };
      case UPDATE_INCO_TERMS_SUCCESS:
        return {
          ...state,
          listIncoTerm: false,
          updateIncoTerm: action.payload,
        };
      case DELETE_INCO_TERMS_SUCCESS:
        return {
          ...state,
          listIncoTerm: false,
          deleteIncoTerm: action.payload,
        };
  
      case GET_INCO_TERMS_FAIL:
        return {
          ...state,
          listIncoTerm: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default incoTerms;
  