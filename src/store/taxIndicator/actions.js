import { GET_TAXINDICATOR, ADD_TAXINDICATOR_SUCCESS, GET_TAXINDICATOR_FAIL, GET_TAXINDICATOR_SUCCESS,
  UPDATE_TAXINDICATOR_SUCCESS,DELETE_TAXINDICATOR_SUCCESS
 } from "./actionTypes"
export const getTaxIndicator = (tax_indicator_type) => ({
  type: GET_TAXINDICATOR,
  payload : tax_indicator_type
})

export const getTaxIndicatorSuccess = taxIndicator => ({
  type: GET_TAXINDICATOR_SUCCESS,
  payload: taxIndicator,
})

export const addTaxIndicator= taxIndicatorData => ({
  type: ADD_TAXINDICATOR_SUCCESS,
  payload: taxIndicatorData,
});

export const updateTaxIndicator = taxIndicatorData => ({
  type: UPDATE_TAXINDICATOR_SUCCESS,
  payload: taxIndicatorData,
});

export const deleteTaxIndicator = taxIndicatorData => ({
  type: DELETE_TAXINDICATOR_SUCCESS,
  payload: taxIndicatorData,
});

export const getTaxIndicatorFail = error => ({
  type: GET_TAXINDICATOR_FAIL,
  payload: error,
})
