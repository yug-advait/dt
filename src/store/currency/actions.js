import { GET_CURRENCY, ADD_CURRENCY_SUCCESS, GET_CURRENCY_FAIL, GET_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_SUCCESS,DELETE_CURRENCY_SUCCESS
 } from "./actionTypes"
export const getcurrency = () => ({
  type: GET_CURRENCY,
})

export const getCurrencySuccess = currency => 
  ({
  type: GET_CURRENCY_SUCCESS,
  payload: currency,
})

export const addCurrency= currencyData => ({
  type: ADD_CURRENCY_SUCCESS,
  payload: currencyData,
});

export const updateCurrency = currencyData => ({
  type: UPDATE_CURRENCY_SUCCESS,
  payload: currencyData,
});

export const deleteCurrency = currencyData => ({
  type: DELETE_CURRENCY_SUCCESS,
  payload: currencyData,
});

export const getCurrencyFail = error => ({
  type: GET_CURRENCY_FAIL,
  payload: error,
})
