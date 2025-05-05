import {
    GET_PURCHASE_GROUPS_SUCCESS,
    GET_PURCHASE_GROUPS_FAIL,
    ADD_PURCHASE_GROUPS_SUCCESS,
    UPDATE_PURCHASE_GROUPS_REQUEST,
    DELETE_PURCHASE_GROUPS_REQUEST,
  } from "./actionTypes";
  
  const INIT_STATE = {
    purchaseGroups: [],
    error: {},
  };
  
  const purchaseGroups = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PURCHASE_GROUPS_SUCCESS:
        return {
          ...state,
          listPurchaseGroup: true,
          addPurchaseGroup: false,
          updatePurchaseGroup: false,
          deletePurchaseGroup: false,
          purchaseGroups: action.payload,
        };
      case ADD_PURCHASE_GROUPS_SUCCESS:
        return {
          ...state,
          listPurchaseGroup: false,
          addPurchaseGroup: action.payload,
        };
      case UPDATE_PURCHASE_GROUPS_REQUEST:
        return {
          ...state,
          listPurchaseGroup: false,
          updatePurchaseGroup: action.payload,
        };
      case DELETE_PURCHASE_GROUPS_REQUEST:
        return {
          ...state,
          listPurchaseGroup: false,
          deletePurchaseGroup: action.payload,
        };
  
      case GET_PURCHASE_GROUPS_FAIL:
        return {
          ...state,
          listPurchaseGroup: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default purchaseGroups;
  