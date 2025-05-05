import {
    GET_REVENUE_INDICATORS, ADD_REVENUE_INDICATORS_SUCCESS, GET_REVENUE_INDICATORS_FAIL, GET_REVENUE_INDICATORS_SUCCESS,
    UPDATE_REVENUE_INDICATORS_SUCCESS, DELETE_REVENUE_INDICATORS_SUCCESS
} from "./actionTypes";

// Get Revenue Indicators
export const getReveueIndicators = (revenue_indicator_type) => ({
    type: GET_REVENUE_INDICATORS,
    payload: { revenue_indicator_type },
});

// Get Revenue Indicators Success
export const getRevenueIndicatorSuccess = (revenueIndicators) => (
    {
        type: GET_REVENUE_INDICATORS_SUCCESS,
        payload: revenueIndicators
    });

// Add Revenue Indicators
export const addRevenueIndicator = (revenueIndicatorData) => (
    {
        type: ADD_REVENUE_INDICATORS_SUCCESS,
        payload: revenueIndicatorData
    });

// Edit Revenue Indicators
export const updateRevenueIndicator = (revenueIndicatorData) => ({
    type: UPDATE_REVENUE_INDICATORS_SUCCESS,
    payload: revenueIndicatorData
});

// Delete Revenue Indicators
export const deleteRevenueIndicator = (revenueIndicatorData) => ({
    type: DELETE_REVENUE_INDICATORS_SUCCESS,
    payload: revenueIndicatorData
});

// Get Revenue Indicators Fail
export const getRevenueIndicatorFail = (error) => ({
    type: GET_REVENUE_INDICATORS_FAIL,
    payload: error
});
