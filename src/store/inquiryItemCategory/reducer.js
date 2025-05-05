import { GET_INQUIRY_ITEM_SUCCESS, GET_INQUIRY_ITEM_FAIL, ADD_INQUIRY_ITEM_SUCCESS, UPDATE_INQUIRY_ITEM_SUCCESS, DELETE_INQUIRY_ITEM_SUCCESS } from "./actionTypes";

const INIT_STATE = {
    inquiryItemCategories: [],
    error: {},
};

const inquiryItemCategories = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_INQUIRY_ITEM_SUCCESS:
            return {
                ...state,
                listInquiryItem: true,
                addInquiryItem: false,
                updateInquiryItem: false,
                deleteInquiryItem: false,
                inquiryItemCategories: action.payload,
            };

        case ADD_INQUIRY_ITEM_SUCCESS:
            return {
                ...state,
                listInquiryItem: false,
                addInquiryItem: action.payload,
            };

        case UPDATE_INQUIRY_ITEM_SUCCESS:
            return {
                ...state,
                listInquiryItem: false,
                updateInquiryItem: action.payload,
            };

        case DELETE_INQUIRY_ITEM_SUCCESS:
            return {
                ...state,
                listInquiryItem: false,
                deleteInquiryItem: action.payload,
            };

        case GET_INQUIRY_ITEM_FAIL:
            return {
                ...state,
                listInquiryItem: false,
                error: action.payload,
            };

        default:
            return state;
    }

};

export default inquiryItemCategories;
