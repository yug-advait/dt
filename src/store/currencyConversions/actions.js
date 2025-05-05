import { GET_CURRENCYCONVERSIONS, ADD_CURRENCYCONVERSIONS_SUCCESS, GET_CURRENCYCONVERSIONS_FAIL, GET_CURRENCYCONVERSIONS_SUCCESS,
  UPDATE_CURRENCYCONVERSIONS_SUCCESS,DELETE_CURRENCYCONVERSIONS_SUCCESS
 } from "./actionTypes"
export const getCurrencyConversions = () => ({
  type: GET_CURRENCYCONVERSIONS,
})

export const getCurrencyConversionsSuccess = currencyConversions => 
  ({
  type: GET_CURRENCYCONVERSIONS_SUCCESS,
  payload: currencyConversions,
})

export const addCurrencyConversions= currencyConversionsData => ({
  type: ADD_CURRENCYCONVERSIONS_SUCCESS,
  payload: currencyConversionsData,
});

export const updateCurrencyConversions = currencyConversionsData => ({
  type: UPDATE_CURRENCYCONVERSIONS_SUCCESS,
  payload: currencyConversionsData,
});

export const deleteCurrencyConversions = currencyConversionsData => ({
  type: DELETE_CURRENCYCONVERSIONS_SUCCESS,
  payload: currencyConversionsData,
});

export const getCurrencyConversionsFail = error => ({
  type: GET_CURRENCYCONVERSIONS_FAIL,
  payload: error,
})
