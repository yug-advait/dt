import { GET_PR, ADD_PR_SUCCESS, GET_PR_FAIL, GET_PR_SUCCESS,
  UPDATE_PR_SUCCESS,DELETE_PR_SUCCESS
 } from "./actionTypes"
export const getPr = () => ({
  type: GET_PR,
})

export const getPrSuccess = Pr => ({
  type: GET_PR_SUCCESS,
  payload: Pr,
})

export const addPr= PrData => ({
  type: ADD_PR_SUCCESS,
  payload: PrData,
});

export const updatePr = PrData => ({
  type: UPDATE_PR_SUCCESS,
  payload: PrData,
});

export const deletePr = PrData => ({
  type: DELETE_PR_SUCCESS,
  payload: PrData,
});

export const getPrFail = error => ({
  type: GET_PR_FAIL,
  payload: error,
})
