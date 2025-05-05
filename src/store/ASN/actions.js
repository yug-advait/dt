import { GET_ASN, ADD_ASN_SUCCESS, GET_ASN_FAIL, GET_ASN_SUCCESS,
  UPDATE_ASN_SUCCESS,DELETE_ASN_SUCCESS
 } from "./actionTypes"
export const getAsn = () => ({
  type: GET_ASN,
})

export const getAsnSuccess = Asn => ({
  type: GET_ASN_SUCCESS,
  payload: Asn,
})

export const addAsn= AsnData => ({
  type: ADD_ASN_SUCCESS,
  payload: AsnData,
});

export const updateAsn = AsnData => ({
  type: UPDATE_ASN_SUCCESS,
  payload: AsnData,
});

export const deleteAsn = AsnData => ({
  type: DELETE_ASN_SUCCESS,
  payload: AsnData,
});

export const getAsnFail = error => ({
  type: GET_ASN_FAIL,
  payload: error,
})
