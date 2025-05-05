import { GET_DISTRIBUTION, ADD_DISTRIBUTION_SUCCESS, GET_DISTRIBUTION_FAIL, GET_DISTRIBUTION_SUCCESS,
  UPDATE_DISTRIBUTION_SUCCESS,DELETE_DISTRIBUTION_SUCCESS
 } from "./actionTypes"
export const getDistribution = () => ({
  type: GET_DISTRIBUTION,
})

export const getDistributionSuccess = distribution => 
  ({
  type: GET_DISTRIBUTION_SUCCESS,
  payload: distribution,
})

export const addDistribution= distributionData => ({
  type: ADD_DISTRIBUTION_SUCCESS,
  payload: distributionData,
});

export const updateDistribution = distributionData => ({
  type: UPDATE_DISTRIBUTION_SUCCESS,
  payload: distributionData,
});

export const deleteDistribution = distributionData => ({
  type: DELETE_DISTRIBUTION_SUCCESS,
  payload: distributionData,
});

export const getDistributionFail = error => ({
  type: GET_DISTRIBUTION_FAIL,
  payload: error,
})
