import { GET_INQUIRY_ITEM, ADD_INQUIRY_ITEM_SUCCESS, GET_INQUIRY_ITEM_FAIL, GET_INQUIRY_ITEM_SUCCESS,
    UPDATE_INQUIRY_ITEM_SUCCESS,DELETE_INQUIRY_ITEM_SUCCESS
   } from "./actionTypes";

// Get InquiryItem
  export const getInquiryItem = () => ({
    type: GET_INQUIRY_ITEM,
  })
  
  // Get InquiryItem Success
  export const getInquiryItemSuccess = (inquiryItemData) => 
    ({
    type: GET_INQUIRY_ITEM_SUCCESS,
    payload: inquiryItemData,
  })
  
  // Create InquiryItem
  export const addInquiryItem = (inquiryItemData) => ({
    type: ADD_INQUIRY_ITEM_SUCCESS,
    payload: inquiryItemData,
  });
  
   // Edit InquiryItem
  export const updateInquiryItem = (inquiryItemData) => ({
    type: UPDATE_INQUIRY_ITEM_SUCCESS,
    payload: inquiryItemData,
  });
  
   // Delete InquiryItem
  export const deleteInquiryItem = (inquiryItemData) => ({
    type: DELETE_INQUIRY_ITEM_SUCCESS,
    payload: inquiryItemData,
  });
  
   // Get InquiryItem Fail
  export const getInquiryItemFail = (error) => ({
    type: GET_INQUIRY_ITEM_FAIL,
    payload: error,
  })
  