import { GET_CITIES, ADD_CITIES_SUCCESS, GET_CITIES_FAIL, GET_CITIES_SUCCESS,
  UPDATE_CITIES_SUCCESS,DELETE_CITIES_SUCCESS
 } from "./actionTypes"
export const getCities = () => ({
  type: GET_CITIES,
})

export const getCitiesSuccess = cities => 
  ({
  type: GET_CITIES_SUCCESS,
  payload: cities,
})

export const addCities= citiesData => ({
  type: ADD_CITIES_SUCCESS,
  payload: citiesData,
});

export const updateCities = citiesData => ({
  type: UPDATE_CITIES_SUCCESS,
  payload: citiesData,
});

export const deleteCities = citiesData => ({
  type: DELETE_CITIES_SUCCESS,
  payload: citiesData,
});

export const getCitiesFail = error => ({
  type: GET_CITIES_FAIL,
  payload: error,
})
