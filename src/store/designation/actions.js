import { GET_DESIGNATIONS, ADD_DESIGNATIONS_SUCCESS, GET_DESIGNATIONS_FAIL, GET_DESIGNATIONS_SUCCESS,
    UPDATE_DESIGNATIONS_SUCCESS,DELETE_DESIGNATIONS_SUCCESS
   } from "./actionTypes";

// Get Designations
export const getDesignations = () => ({
    type : GET_DESIGNATIONS
});

// Get Designations Success
export const getDesignationSuccess = (designations) => (
    {
    type : GET_DESIGNATIONS_SUCCESS,
    payload : designations
});

// Add Designations
export const addDesignation = (designationsData) => ({
    type : ADD_DESIGNATIONS_SUCCESS,
    payload : designationsData
});

// Edit Designations
export const updateDesignation = (designationsData) => ({
    type : UPDATE_DESIGNATIONS_SUCCESS,
    payload : designationsData
});

// Delete Designations
export const deleteDesignation = (designationsData) => ({
    type : DELETE_DESIGNATIONS_SUCCESS,
    payload : designationsData
});

// Get Designations Fail
export const getDesignationFail = (error) => ({
    type : GET_DESIGNATIONS_FAIL,
    payload : error
})

