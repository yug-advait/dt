import { GET_SALESOFFICE, ADD_SALESOFFICE_SUCCESS, GET_SALESOFFICE_FAIL, GET_SALESOFFICE_SUCCESS,
  UPDATE_SALESOFFICE_SUCCESS,DELETE_SALESOFFICE_SUCCESS
 } from "./actionTypes"
export const getSalesOffice = () => ({
  type: GET_SALESOFFICE,
})

export const getSalesOfficeSuccess = salesoffice => 
  ({
  type: GET_SALESOFFICE_SUCCESS,
  payload: salesoffice,
})

export const addSalesOffice= salesofficeData => ({
  type: ADD_SALESOFFICE_SUCCESS,
  payload: salesofficeData,
});

export const updateSalesOffice = salesofficeData => ({
  type: UPDATE_SALESOFFICE_SUCCESS,
  payload: salesofficeData,
});

export const deleteSalesOffice = salesofficeData => ({
  type: DELETE_SALESOFFICE_SUCCESS,
  payload: salesofficeData,
});

export const getSalesOfficeFail = error => ({
  type: GET_SALESOFFICE_FAIL,
  payload: error,
})
