import { GET_UNITOFMEASURE, ADD_UNITOFMEASURE_SUCCESS, GET_UNITOFMEASURE_FAIL, GET_UNITOFMEASURE_SUCCESS,
  UPDATE_UNITOFMEASURE_SUCCESS,DELETE_UNITOFMEASURE_SUCCESS
 } from "./actionTypes"
export const getUnitOfMeasure = () => ({
  type: GET_UNITOFMEASURE,
})
                                                                
export const getUnitOfMeasureSuccess = unitOfMeasure => 
  ({
  type: GET_UNITOFMEASURE_SUCCESS,
  payload: unitOfMeasure,
})

export const addUnitOfMeasure= unitOfMeasureData => ({
  type: ADD_UNITOFMEASURE_SUCCESS,
  payload: unitOfMeasureData,
});

export const updateUnitOfMeasure = unitOfMeasureData => ({
  type: UPDATE_UNITOFMEASURE_SUCCESS,
  payload: unitOfMeasureData,
});

export const deleteUnitOfMeasure = unitOfMeasureData => ({
  type: DELETE_UNITOFMEASURE_SUCCESS,
  payload: unitOfMeasureData,
});

export const getUnitOfMeasureFail = error => ({
  type: GET_UNITOFMEASURE_FAIL,
  payload: error,
})
