import {
    GET_WITHHOLDING_TAX_TYPES_SUCCESS, GET_WITHHOLDING_TAX_TYPES_FAIL, ADD_WITHHOLDING_TAX_TYPES_SUCCESS, UPDATE_WITHHOLDING_TAX_TYPES_SUCCESS,
    DELETE_WITHHOLDING_TAX_TYPES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
    withHoldingTaxTypes : [],
    errors : {}
}
const withHoldingTaxTypes = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_WITHHOLDING_TAX_TYPES_SUCCESS:
            return {
                ...state,
                listWithHoldingTaxType: true,
                addWithHoldingTaxType: false,
                updateWithHoldingTaxType: false,
                deleteWithHoldingTaxType: false,
                withHoldingTaxTypes: action.payload
            }

        case ADD_WITHHOLDING_TAX_TYPES_SUCCESS:
            return {
                ...state,
                listWithHoldingTaxType: false,
                addWithHoldingTaxType: action.payload
            }

        case UPDATE_WITHHOLDING_TAX_TYPES_SUCCESS:
            return {
                ...state,
                listWithHoldingTaxType: false,
                updateWithHoldingTaxType: action.payload
            }

        case DELETE_WITHHOLDING_TAX_TYPES_SUCCESS:
            return {
                ...state,
                listWithHoldingTaxType: false,
                deleteWithHoldingTaxType: action.payload
            }

        case GET_WITHHOLDING_TAX_TYPES_FAIL:
            return {
                ...state,
                listWithHoldingTaxType: false,
                error: action.payload
            }

        default:
            return state;
    }
}

export default withHoldingTaxTypes;