import { GET_QUALITYCHECK, ADD_QUALITYCHECK_SUCCESS, GET_QUALITYCHECK_FAIL, GET_QUALITYCHECK_SUCCESS,
  UPDATE_QUALITYCHECK_SUCCESS,DELETE_QUALITYCHECK_SUCCESS
 } from "./actionTypes"
export const getQualityCheck = () => ({
  type: GET_QUALITYCHECK,
})

export const getQualityCheckSuccess = QualityCheck => ({
  type: GET_QUALITYCHECK_SUCCESS,
  payload: QualityCheck,
})

export const addQualityCheck= QualityCheckData => ({
  type: ADD_QUALITYCHECK_SUCCESS,
  payload: QualityCheckData,
});

export const updateQualityCheck = QualityCheckData => ({
  type: UPDATE_QUALITYCHECK_SUCCESS,
  payload: QualityCheckData,
});

export const deleteQualityCheck = QualityCheckData => ({
  type: DELETE_QUALITYCHECK_SUCCESS,
  payload: QualityCheckData,
});

export const getQualityCheckFail = error => ({
  type: GET_QUALITYCHECK_FAIL,
  payload: error,
})
