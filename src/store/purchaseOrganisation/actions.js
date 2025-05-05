import {
    GET_PURCHASE_ORGANISATION,
    GET_PURCHASE_ORGANISATION_FAIL,
    GET_PURCHASE_ORGANISATION_SUCCESS,
    ADD_PURCHASE_ORGANISATION_SUCCESS,
    UPDATE_PURCHASE_ORGANISATION_SUCCESS,
    DELETE_PURCHASE_ORGANISATION_SUCCESS
} from "./actionTypes";

// Get Purchase Organisation
export const getPurchaseOrganisations = () => ({
    type: GET_PURCHASE_ORGANISATION
});

// Get Purchase Organisation Success
export const getPurchaseOrganisationSuccess = (purchaseOrganisations) => ({
    type: GET_PURCHASE_ORGANISATION_SUCCESS,
    payload: purchaseOrganisations
});

// Add Purchase Organisation
export const addPurchaseOrganisation = (purchaseOrganisationsData) => ({
    type: ADD_PURCHASE_ORGANISATION_SUCCESS,
    payload: purchaseOrganisationsData
});

// Edit Purchase Organisation
export const updatePurchaseOrganisation = (purchaseOrganisationsData) => ({
    type: UPDATE_PURCHASE_ORGANISATION_SUCCESS,
    payload: purchaseOrganisationsData
});

// Delete Purchase Organisation
export const deletePurchaseOrganisation = (purchaseOrganisationsData) => ({
    type: DELETE_PURCHASE_ORGANISATION_SUCCESS,
    payload: purchaseOrganisationsData
});

// Get Purchase Organisations Fail
export const getPurchaseOrganisationFail = (error) => ({
    type: GET_PURCHASE_ORGANISATION_FAIL,
    payload: error
});