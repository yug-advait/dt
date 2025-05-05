import { GET_SALESORGANISATION, ADD_SALESORGANISATION_SUCCESS, GET_SALESORGANISATION_FAIL, GET_SALESORGANISATION_SUCCESS,
  UPDATE_SALESORGANISATION_SUCCESS,DELETE_SALESORGANISATION_SUCCESS
 } from "./actionTypes"
export const getSalesOrganisation = () => ({
  type: GET_SALESORGANISATION,
})

export const getSalesOrganisationSuccess = salesorganisation => 
  ({
  type: GET_SALESORGANISATION_SUCCESS,
  payload: salesorganisation,
})

export const addSalesOrganisation= salesorganisationData => ({
  type: ADD_SALESORGANISATION_SUCCESS,
  payload: salesorganisationData,
});

export const updateSalesOrganisation = salesorganisationData => ({
  type: UPDATE_SALESORGANISATION_SUCCESS,
  payload: salesorganisationData,
});

export const deleteSalesOrganisation = salesorganisationData => ({
  type: DELETE_SALESORGANISATION_SUCCESS,
  payload: salesorganisationData,
});

export const getSalesOrganisationFail = error => ({
  type: GET_SALESORGANISATION_FAIL,
  payload: error,
})
