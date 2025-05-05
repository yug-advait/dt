import {
    GET_SALES_ORDER_DOCTYPE_SUCCESS,
    GET_SALES_ORDER_DOCTYPE_FAIL,
    ADD_SALES_ORDER_DOCTYPE_SUCCESS,
    UPDATE_SALES_ORDER_DOCTYPE_SUCCESS,
    DELETE_SALES_ORDER_DOCTYPE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
    salesOrderDocType: [],
    error: {},
};

const salesOrderDocType = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SALES_ORDER_DOCTYPE_SUCCESS:
            return {
                ...state,
                listSalesOrderDocType: true,
                addSalesOrderDocType: false,
                updateSalesOrderDocType: false,
                deleteSalesOrderDocType: false,
                salesOrderDocType: action.payload,
            };

        case ADD_SALES_ORDER_DOCTYPE_SUCCESS:
            return {
                ...state,
                listSalesOrderDocType: false,
                addSalesOrderDocType: action.payload,
            };

        case UPDATE_SALES_ORDER_DOCTYPE_SUCCESS:
            return {
                ...state,
                listSalesOrderDocType: false,
                updateSalesOrderDocType: action.payload,
            };
            
        case DELETE_SALES_ORDER_DOCTYPE_SUCCESS:
            return {
                ...state,
                listSalesOrderDocType: false,
                deleteSalesOrderDocType: action.payload,
            };

        case GET_SALES_ORDER_DOCTYPE_FAIL:
            return {
                ...state,
                listSalesOrderDocType: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default salesOrderDocType;
