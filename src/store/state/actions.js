import { GET_STATES, ADD_STATES_SUCCESS, GET_STATES_FAIL, GET_STATES_SUCCESS,
  UPDATE_STATES_SUCCESS,DELETE_STATES_SUCCESS
 } from "./actionTypes"
export const getStates = () => ({
  type: GET_STATES,
})

export const getStatesSuccess = states => 
  ({
  type: GET_STATES_SUCCESS,
  payload: states,
})

export const addStates= stateData => ({
  type: ADD_STATES_SUCCESS,
  payload: stateData,
});

export const updateStates = stateData => ({
  type: UPDATE_STATES_SUCCESS,
  payload: stateData,
});

export const deleteStates = stateData => ({
  type: DELETE_STATES_SUCCESS,
  payload: stateData,
});

export const getStatesFail = error => ({
  type: GET_STATES_FAIL,
  payload: error,
})
