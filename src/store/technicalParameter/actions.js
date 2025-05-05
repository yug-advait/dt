import { GET_TECHNICALPARAMETER, ADD_TECHNICALPARAMETER_SUCCESS, GET_TECHNICALPARAMETER_FAIL, GET_TECHNICALPARAMETER_SUCCESS,
  UPDATE_TECHNICALPARAMETER_SUCCESS,DELETE_TECHNICALPARAMETER_SUCCESS
 } from "./actionTypes"
export const getTechnicalParameter = () => ({
  type: GET_TECHNICALPARAMETER,
})
                                                                
export const getTechnicalParameterSuccess = technicalParameter => 
  ({
  type: GET_TECHNICALPARAMETER_SUCCESS,
  payload: technicalParameter,
})

export const addTechnicalParameter= technicalParameterData => ({
  type: ADD_TECHNICALPARAMETER_SUCCESS,
  payload: technicalParameterData,
});

export const updateTechnicalParameter = technicalParameterData => ({
  type: UPDATE_TECHNICALPARAMETER_SUCCESS,
  payload: technicalParameterData,
});

export const deleteTechnicalParameter = technicalParameterData => ({
  type: DELETE_TECHNICALPARAMETER_SUCCESS,
  payload: technicalParameterData,
});

export const getTechnicalParameterFail = error => ({
  type: GET_TECHNICALPARAMETER_FAIL,
  payload: error,
})
