import { GET_COMPANYLEGALENTITY, ADD_COMPANYLEGALENTITY_SUCCESS, GET_COMPANYLEGALENTITY_FAIL, GET_COMPANYLEGALENTITY_SUCCESS,
  UPDATE_COMPANYLEGALENTITY_SUCCESS,DELETE_COMPANYLEGALENTITY_SUCCESS
 } from "./actionTypes"
export const getCompanyLegalEntity = () => ({
  type: GET_COMPANYLEGALENTITY,
})

export const getCompanyLegalEntitySuccess = companyLegalEntity => 
  ({
  type: GET_COMPANYLEGALENTITY_SUCCESS,
  payload: companyLegalEntity,
})

export const addCompanyLegalEntity= companyLegalEntityData => ({
  type: ADD_COMPANYLEGALENTITY_SUCCESS,
  payload: companyLegalEntityData,
});

export const updateCompanyLegalEntity = companyLegalEntityData => ({
  type: UPDATE_COMPANYLEGALENTITY_SUCCESS,
  payload: companyLegalEntityData,
});

export const deleteCompanyLegalEntity = companyLegalEntityData => ({
  type: DELETE_COMPANYLEGALENTITY_SUCCESS,
  payload: companyLegalEntityData,
});

export const getCompanyLegalEntityFail = error => ({
  type: GET_COMPANYLEGALENTITY_FAIL,
  payload: error,
})
