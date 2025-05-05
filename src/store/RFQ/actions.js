import { GET_RFQ, ADD_RFQ_SUCCESS, GET_RFQ_FAIL, GET_RFQ_SUCCESS,
  UPDATE_RFQ_SUCCESS,DELETE_RFQ_SUCCESS
 } from "./actionTypes"
export const getRfq = () => ({
  type: GET_RFQ,
})

export const getRfqSuccess = Rfq => ({
  type: GET_RFQ_SUCCESS,
  payload: Rfq,
})

export const addRfq= RfqData => ({
  type: ADD_RFQ_SUCCESS,
  payload: RfqData,
});

export const updateRfq = RfqData => ({
  type: UPDATE_RFQ_SUCCESS,
  payload: RfqData,
});

export const deleteRfq = RfqData => ({
  type: DELETE_RFQ_SUCCESS,
  payload: RfqData,
});

export const getRfqFail = error => ({
  type: GET_RFQ_FAIL,
  payload: error,
})
