import { takeEvery,call, put } from "redux-saga/effects";
import { getMaterialGroupSuccess, getMaterialGroupFail,addMaterialGroup,updateMaterialGroup,deleteMaterialGroup } from "./actions";
import { ADD_MATERIALGROUP_REQUEST,GET_MATERIALGROUP_REQUEST,UPDATE_MATERIALGROUP_REQUEST,DELETE_MATERIALGROUP_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getMaterialGroup,addMaterialGroupApiCall } from "helpers/Api/api_materialGroup";

function* materialGroupSaga() {
  try {
    const response = yield call(getMaterialGroup)
    yield put(getMaterialGroupSuccess(response))
  } catch (error) {
    yield put(getMaterialGroupFail(error));
  }
}

function* addMaterialGroupSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addMaterialGroupApiCall,formData,isActive,0,false)
   yield put(addMaterialGroup(response));
  } catch (error) {
    yield put(getMaterialGroupFail(error));
  }
}
function* updateMaterialGroupSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addMaterialGroupApiCall,formData,isActive,Id,false)
   yield put(updateMaterialGroup(response));
  } catch (error) {
    yield put(getMaterialGroupFail(error));
  }
}
function* deleteMaterialGroupSaga(action) {
  try {
    const response = yield call(addMaterialGroupApiCall,'','',action.payload,true)
   yield put(deleteMaterialGroup(response))
  } catch (error) {
    yield put(getMaterialGroupFail(error))
  }
}

function* materialGroupAllSaga() {
  yield takeEvery(ADD_MATERIALGROUP_REQUEST, addMaterialGroupSaga)
  yield takeEvery(UPDATE_MATERIALGROUP_REQUEST, updateMaterialGroupSaga)
  yield takeEvery(DELETE_MATERIALGROUP_REQUEST, deleteMaterialGroupSaga)
  yield takeEvery(GET_MATERIALGROUP_REQUEST, materialGroupSaga)
}

export {materialGroupAllSaga} 