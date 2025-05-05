import { retry } from "redux-saga/effects";
import {
    GET_REVENUE_INDICATORS_SUCCESS, GET_REVENUE_INDICATORS_FAIL, ADD_REVENUE_INDICATORS_SUCCESS, UPDATE_REVENUE_INDICATORS_SUCCESS,
    DELETE_REVENUE_INDICATORS_SUCCESS,
} from "./actionTypes";


const INIT_STATE = {
    revenueIndicators: [],
    errors: {}
};

const revenueIndicators = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_REVENUE_INDICATORS_SUCCESS:
            return {
                ...state,
                listRevenueIndicator: true,
                addRevenueIndicator: false,
                updateRevenueIndicator: false,
                deleteRevenueIndicator: false,
                revenueIndicators: action.payload
            }

        case ADD_REVENUE_INDICATORS_SUCCESS:
            return {
                ...state,
                listRevenueIndicator: false,
                addRevenueIndicator: action.payload
            }

        case UPDATE_REVENUE_INDICATORS_SUCCESS:
            return {
                ...state,
                listRevenueIndicator: false,
                updateRevenueIndicator: action.payload
            }

        case DELETE_REVENUE_INDICATORS_SUCCESS:
            return{
                ...state,
                listRevenueIndicator: false,
                deleteRevenueIndicator : action.payload
            }
        
            default : 
                return state;
    }
};

export default revenueIndicators;
