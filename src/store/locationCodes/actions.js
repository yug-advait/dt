import { GET_LOCATIONCODES, ADD_LOCATIONCODES_SUCCESS, GET_LOCATIONCODES_FAIL, GET_LOCATIONCODES_SUCCESS,
  UPDATE_LOCATIONCODES_SUCCESS,DELETE_LOCATIONCODES_SUCCESS
 } from "./actionTypes"
export const getLocationCodes = () => ({
  type: GET_LOCATIONCODES,
})

export const getLocationCodesSuccess = locationCodes => ({
  type: GET_LOCATIONCODES_SUCCESS,
  payload: locationCodes,
})

export const addLocationCodes= locationCodesData => ({
  type: ADD_LOCATIONCODES_SUCCESS,
  payload: locationCodesData,
});

export const updateLocationCodes = locationCodesData => ({
  type: UPDATE_LOCATIONCODES_SUCCESS,
  payload: locationCodesData,
});

export const deleteLocationCodes = locationCodesData => ({
  type: DELETE_LOCATIONCODES_SUCCESS,
  payload: locationCodesData,
});

export const getLocationCodesFail = error => ({
  type: GET_LOCATIONCODES_FAIL,
  payload: error,
})
