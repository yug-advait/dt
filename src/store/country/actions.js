import { GET_COUNTRIES, ADD_COUNTRIES_SUCCESS, GET_COUNTRIES_FAIL, GET_COUNTRIES_SUCCESS,
  UPDATE_COUNTRIES_SUCCESS,DELETE_COUNTRIES_SUCCESS
 } from "./actionTypes"
export const getCountries = () => ({
  type: GET_COUNTRIES,
})

export const getCountriesSuccess = countries => 
  ({
  type: GET_COUNTRIES_SUCCESS,
  payload: countries,
})

export const addCountries = countryData => ({
  type: ADD_COUNTRIES_SUCCESS,
  payload: countryData,
});

export const updateCountries = countryData => ({
  type: UPDATE_COUNTRIES_SUCCESS,
  payload: countryData,
});

export const deleteCountries = countryData => ({
  type: DELETE_COUNTRIES_SUCCESS,
  payload: countryData,
});

export const getCountriesFail = error => ({
  type: GET_COUNTRIES_FAIL,
  payload: error,
})
