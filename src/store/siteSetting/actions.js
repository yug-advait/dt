import { GET_SITESETTING, ADD_SITESETTING_SUCCESS, GET_SITESETTING_FAIL, GET_SITESETTING_SUCCESS,
  UPDATE_SITESETTING_SUCCESS,DELETE_SITESETTING_SUCCESS
 } from "./actionTypes"
export const getSiteSetting = () => ({
  type: GET_SITESETTING,
})
                                                                
export const getSiteSettingSuccess = siteSetting => 
  ({
  type: GET_SITESETTING_SUCCESS,
  payload: siteSetting,
})

export const addSiteSetting= siteSettingData => ({
  type: ADD_SITESETTING_SUCCESS,
  payload: siteSettingData,
});

export const updateSiteSetting = siteSettingData => ({
  type: UPDATE_SITESETTING_SUCCESS,
  payload: siteSettingData,
});

export const deleteSiteSetting = siteSettingData => ({
  type: DELETE_SITESETTING_SUCCESS,
  payload: siteSettingData,
});

export const getSiteSettingFail = error => ({
  type: GET_SITESETTING_FAIL,
  payload: error,
})
