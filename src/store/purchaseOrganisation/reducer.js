import {
    GET_PURCHASE_ORGANISATION_SUCCESS, GET_PURCHASE_ORGANISATION_FAIL, ADD_PURCHASE_ORGANISATION_SUCCESS, UPDATE_PURCHASE_ORGANISATION_SUCCESS,
    DELETE_PURCHASE_ORGANISATION_SUCCESS,
  } from "./actionTypes";

const INIT_STATE = {
    purchaseOrganisations : [],
    errors : {}
}

const purchaseOrganisations = (state = INIT_STATE, action) => {
    switch(action.type){
        case GET_PURCHASE_ORGANISATION_SUCCESS:
            return {
                ...state,
                listPurchaseOrganisation: true,
                addPurchaseOrganisation :  false,
                updatePurchaseOrganisation : false,
                deletePurchaseOrganisation : false,
                purchaseOrganisations : action.payload
            };
        
        case ADD_PURCHASE_ORGANISATION_SUCCESS : 
            return {
                ...state,
                listPurchaseOrganisation: false,
                addPurchaseOrganisation : action.payload
            };
        
        case UPDATE_PURCHASE_ORGANISATION_SUCCESS:
            return {
                ...state,
                listPurchaseOrganisation: false,
                updatePurchaseOrganisation : action.payload
            };
        
        case DELETE_PURCHASE_ORGANISATION_SUCCESS : 
            return {
                ...state,
                listPurchaseOrganisation: false,
                deletePurchaseOrganisation : action.payload
            };
        
        case GET_PURCHASE_ORGANISATION_FAIL : 
            return {
                ...state,
                listPurchaseOrganisation: false,
                error : action.payload
            };
        
        default :
            return state;
    }
};

export default purchaseOrganisations;