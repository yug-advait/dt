import {
    GET_PURCHASE_GROUPS,
    GET_PURCHASE_GROUPS_FAIL,
    GET_PURCHASE_GROUPS_SUCCESS,
    ADD_PURCHASE_GROUPS_SUCCESS,
    UPDATE_PURCHASE_GROUPS_SUCCESS,
    DELETE_PURCHASE_GROUPS_SUCCESS
} from "./actionTypes"

  export const getPurchaseGroups = () => ({
    type: GET_PURCHASE_GROUPS,
  })
  
  export const getPurchaseGroupsSuccess = purchaseGroups => 
    ({
    type: GET_PURCHASE_GROUPS_SUCCESS,
    payload: purchaseGroups,
  })
  
  export const addPurchaseGroup = purchaseGroupData => ({
    type: ADD_PURCHASE_GROUPS_SUCCESS,
    payload: purchaseGroupData,
  });
  
  export const updatePurchaseGroup = purchaseGroupData => ({
    type: UPDATE_PURCHASE_GROUPS_SUCCESS,
    payload: purchaseGroupData,
  });
  
  export const deletePurchaseGroup = purchaseGroupData => ({
    type: DELETE_PURCHASE_GROUPS_SUCCESS,
    payload: purchaseGroupData,
  });
  
  export const getPurchaseGroupsFail = error => ({
    type: GET_PURCHASE_GROUPS_FAIL,
    payload: error,
  })
  