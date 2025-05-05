import { GET_VENDORGROUPS, ADD_VENDORGROUPS_SUCCESS, GET_VENDORGROUPS_FAIL, GET_VENDORGROUPS_SUCCESS,
  UPDATE_VENDORGROUPS_SUCCESS,DELETE_VENDORGROUPS_SUCCESS
 } from "./actionTypes"
export const getVendorGroups = () => ({
  type: GET_VENDORGROUPS,
})

export const getVendorGroupsSuccess = VendorGroups => ({
  type: GET_VENDORGROUPS_SUCCESS,
  payload: VendorGroups,
})

export const addVendorGroups= VendorGroupsData => ({
  type: ADD_VENDORGROUPS_SUCCESS,
  payload: VendorGroupsData,
});

export const updateVendorGroups = VendorGroupsData => ({
  type: UPDATE_VENDORGROUPS_SUCCESS,
  payload: VendorGroupsData,
});

export const deleteVendorGroups = VendorGroupsData => ({
  type: DELETE_VENDORGROUPS_SUCCESS,
  payload: VendorGroupsData,
});

export const getVendorGroupsFail = error => ({
  type: GET_VENDORGROUPS_FAIL,
  payload: error,
})
