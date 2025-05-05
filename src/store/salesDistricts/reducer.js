import {
    GET_SALES_DISTRICT_SUCCESS, GET_SALES_DISTRICT_FAIL, ADD_SALES_DISTRICT_SUCCESS, UPDATE_SALES_DISTRICT_SUCCESS,
    DELETE_SALES_DISTRICT_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
    salesDistricts: [],
    error: {}
}

const salesDistricts = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SALES_DISTRICT_SUCCESS:
            return {
                ...state,
                listSalesDistricts: true,
                addSalesDistricts: false,
                updateSalesDistricts: false,
                deleteSalesDistricts: false,
                salesDistricts: action.payload
            };

        case ADD_SALES_DISTRICT_SUCCESS:
            return {
                ...state,
                listSalesDistricts: false,
                addSalesDistricts: action.payload
            };

        case UPDATE_SALES_DISTRICT_SUCCESS:
            return {
                ...state,
                listSalesDistricts: false,
                updateSalesDistricts: action.payload
            };

        case DELETE_SALES_DISTRICT_SUCCESS:
            return {
                ...state,
                listSalesDistricts: false,
                deleteSalesDistricts: action.payload
            };

        case GET_SALES_DISTRICT_FAIL:
            return {
                ...state,
                listSalesDistricts: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default salesDistricts;