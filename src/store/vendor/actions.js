import { GET_VENDOR, ADD_VENDOR_SUCCESS, GET_VENDOR_FAIL, GET_VENDOR_SUCCESS,
  UPDATE_VENDOR_SUCCESS,DELETE_VENDOR_SUCCESS
 } from "./actionTypes"
export const getVendor = () => ({
  type: GET_VENDOR,
})

export const getVendorSuccess = Vendor => ({
  type: GET_VENDOR_SUCCESS,
  payload: Vendor,
})

export const addVendor= VendorData => ({
  type: ADD_VENDOR_SUCCESS,
  payload: VendorData,
});

export const updateVendor = VendorData => ({
  type: UPDATE_VENDOR_SUCCESS,
  payload: VendorData,
});

export const deleteVendor = VendorData => ({
  type: DELETE_VENDOR_SUCCESS,
  payload: VendorData,
});

export const getVendorFail = error => ({
  type: GET_VENDOR_FAIL,
  payload: error,
})
