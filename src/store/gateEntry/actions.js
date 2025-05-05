import { GET_GATEENTRY, ADD_GATEENTRY_SUCCESS, GET_GATEENTRY_FAIL, GET_GATEENTRY_SUCCESS,
  UPDATE_GATEENTRY_SUCCESS,DELETE_GATEENTRY_SUCCESS
 } from "./actionTypes"
export const getGateEntry = () => ({
  type: GET_GATEENTRY,
})

export const getGateEntrySuccess = GateEntry => ({
  type: GET_GATEENTRY_SUCCESS,
  payload: GateEntry,
})

export const addGateEntry= GateEntryData => ({
  type: ADD_GATEENTRY_SUCCESS,
  payload: GateEntryData,
});

export const updateGateEntry = GateEntryData => ({
  type: UPDATE_GATEENTRY_SUCCESS,
  payload: GateEntryData,
});

export const deleteGateEntry = GateEntryData => ({
  type: DELETE_GATEENTRY_SUCCESS,
  payload: GateEntryData,
});

export const getGateEntryFail = error => ({
  type: GET_GATEENTRY_FAIL,
  payload: error,
})
