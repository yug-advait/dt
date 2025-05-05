import { GET_WITHHOLDING_TAX_TYPES, GET_WITHHOLDING_TAX_TYPES_SUCCESS, GET_WITHHOLDING_TAX_TYPES_FAIL, ADD_WITHHOLDING_TAX_TYPES_SUCCESS, 
    UPDATE_WITHHOLDING_TAX_TYPES_SUCCESS, DELETE_WITHHOLDING_TAX_TYPES_SUCCESS
   } from "./actionTypes";

// Get Witholding Tax Type
export const getWithHoldingTaxTypes = () => ({
    type : GET_WITHHOLDING_TAX_TYPES
});

// Get Witholding Tax Type Success
export const getWithHoldingTaxTypeSuccess = witholdingTaxTypesData => ({
    type: GET_WITHHOLDING_TAX_TYPES_SUCCESS,
    payload: witholdingTaxTypesData
});

// Add Witholding Tax Type
export const addWithHoldingTaxType = (witholdingTaxTypeData) => ({
    type : ADD_WITHHOLDING_TAX_TYPES_SUCCESS,
    payload : witholdingTaxTypeData
});

// Edit Witholding Tax Type
export const updateWitholdingTaxType = (witholdingTaxTypeData) => ({
    type : UPDATE_WITHHOLDING_TAX_TYPES_SUCCESS,
    payload : witholdingTaxTypeData
});

// Delete Witholding Tax Type
export const deleteWitholdingTaxType = (witholdingTaxTypeData) => ({
    type : DELETE_WITHHOLDING_TAX_TYPES_SUCCESS,
    payload : witholdingTaxTypeData
});

// Get Witholding Tax Type
export const getWithHoldingTaxTypeFail = (error) => ({
    type : GET_WITHHOLDING_TAX_TYPES_FAIL,
    payload : error
});