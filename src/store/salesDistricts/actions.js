// Import Action Types Constants.
import {
    GET_SALES_DISTRICT, ADD_SALES_DISTRICT_SUCCESS, GET_SALES_DISTRICT_FAIL, GET_SALES_DISTRICT_SUCCESS,
    UPDATE_SALES_DISTRICT_SUCCESS, DELETE_SALES_DISTRICT_SUCCESS
} from "./actionTypes";

// Get SalesDistricts
export const getSalesDistricts = () => ({
    type: GET_SALES_DISTRICT
});

// Get SalesDistricts Success
export const getSalesDistrictSuccess = (salesDistricts) => (
    {
        type: GET_SALES_DISTRICT_SUCCESS,
        payload: salesDistricts
    });

// Add SalesDistricts
export const addSalesDistrict = (salesDistrictsData) => ({
    type: ADD_SALES_DISTRICT_SUCCESS,
    payload: salesDistrictsData
});

// Edit SalesDistricts
export const updateSalesDistrict = (salesDistrictsData) => ({
    type: UPDATE_SALES_DISTRICT_SUCCESS,
    payload: salesDistrictsData
});

// Delete SalesDistricts
export const deleteSalesDistrict = (salesDistrictsData) => ({
    type: DELETE_SALES_DISTRICT_SUCCESS,
    payload: salesDistrictsData
});

// Get SalesDistricts Fail
export const getSalesDistrictFail = (error) => ({
    type: GET_SALES_DISTRICT_FAIL,
    payload: error
})
