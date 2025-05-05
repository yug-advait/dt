import { takeEvery,call, put } from "redux-saga/effects";
import { getSiteSettingSuccess, getSiteSettingFail,addSiteSetting,updateSiteSetting,deleteSiteSetting } from "./actions";
import { ADD_SITESETTING_REQUEST,GET_SITESETTING_REQUEST,UPDATE_SITESETTING_REQUEST,DELETE_SITESETTING_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getSiteSetting,addSiteSettingApiCall } from "helpers/Api/api_siteSetting";

function* siteSettingSaga() {
  try {
    const response = yield call(getSiteSetting)
    yield put(getSiteSettingSuccess(response))
  } catch (error) {
    yield put(getSiteSettingFail(error));
  }
}

function* addsiteSettingSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addSiteSettingApiCall,formData,isActive,0,false)
   yield put(addSiteSetting(response));
  } catch (error) {
    yield put(getSiteSettingFail(error));
  }
}
function* updatesiteSettingSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addSiteSettingApiCall,formData,isActive,Id,false)
   yield put(updateSiteSetting(response));
  } catch (error) {
    yield put(getSiteSettingFail(error));
  }
}
function* deletesiteSettingSaga(action) {
  try {
    const response = yield call(addSiteSettingApiCall,'','',action.payload,true)
   yield put(deleteSiteSetting(response))
  } catch (error) {
    yield put(getSiteSettingFail(error))
  }
}

function* siteSettingAllSaga() {
  yield takeEvery(ADD_SITESETTING_REQUEST, addsiteSettingSaga)
  yield takeEvery(UPDATE_SITESETTING_REQUEST, updatesiteSettingSaga)
  yield takeEvery(DELETE_SITESETTING_REQUEST, deletesiteSettingSaga)
  yield takeEvery(GET_SITESETTING_REQUEST, siteSettingSaga)
}

export {siteSettingAllSaga} 