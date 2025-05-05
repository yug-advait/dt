// Import ActionTypes
import {
    GET_SALES_ORDER_SUCCESS, GET_SALES_ORDER_FAIL, ADD_SALES_ORDER_SUCCESS, UPDATE_SALES_ORDER_SUCCESS, 
    DELETE_SALES_ORDER_SUCCESS
} from './actionTypes';

// SETUP Inital State
const INIT_STATE = {
    salesOrders : [],
    errors : {}
};

const salesOrders = (state = INIT_STATE, action) => {
    switch(action.type){
        case GET_SALES_ORDER_SUCCESS :
            return {
                ...state,
                listSalesOrders : true,
                addSalesOrders : false,
                updateSalesOrders : false,
                deleteSalesOrders : false,
                salesOrders : action.payload
            };

        case ADD_SALES_ORDER_SUCCESS : 
            return {
                ...state,
                listSalesOrders : false,
                addSalesOrders : action.payload
            };
        
        case UPDATE_SALES_ORDER_SUCCESS : 
            return {
                ...state,
                listSalesOrders : false,
                updateSalesOrders : action.payload
            };

        case DELETE_SALES_ORDER_SUCCESS : 
            return {
                ...state,
                listSalesOrders : false,
                deleteSalesOrders : action.payload
            };

        case GET_SALES_ORDER_FAIL : 
            return {
                ...state,
                listSalesOrders : false,
                error : action.payload,
            };
        
        default :
            return state;
    }
}

export default salesOrders;