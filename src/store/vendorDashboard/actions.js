import { GET_VENDORDASHBOARD, ADD_VENDORDASHBOARD_SUCCESS, GET_VENDORDASHBOARD_FAIL, GET_VENDORDASHBOARD_SUCCESS,
  UPDATE_VENDORDASHBOARD_SUCCESS,DELETE_VENDORDASHBOARD_SUCCESS
 } from "./actionTypes"
export const getVendorDashboard = () => ({
  type: GET_VENDORDASHBOARD,
})

export const getVendorDashboardSuccess = vendorDashboard => 
  ({
  type: GET_VENDORDASHBOARD_SUCCESS,
  payload: vendorDashboard,
})

export const addVendorDashboard= vendorDashboardData => ({
  type: ADD_VENDORDASHBOARD_SUCCESS,
  payload: vendorDashboardData,
});

export const updateVendorDashboard = vendorDashboardData => ({
  type: UPDATE_VENDORDASHBOARD_SUCCESS,
  payload: vendorDashboardData,
});

export const deleteVendorDashboard = vendorDashboardData => ({
  type: DELETE_VENDORDASHBOARD_SUCCESS,
  payload: vendorDashboardData,
});

export const getVendorDashboardFail = error => ({
  type: GET_VENDORDASHBOARD_FAIL,
  payload: error,
})
