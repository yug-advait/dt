import { takeEvery,call, put } from "redux-saga/effects";
import { getMaterialTypeSuccess, getMaterialTypeFail,addMaterialType,updateMaterialType,deleteMaterialType } from "./actions";
import { ADD_MATERIALTYPE_REQUEST,GET_MATERIALTYPE_REQUEST,UPDATE_MATERIALTYPE_REQUEST,DELETE_MATERIALTYPE_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getMaterialType,addMaterialTypeApiCall } from "helpers/Api/api_materialType";

function* materialTypeSaga() {
  try {
    const response = yield call(getMaterialType)
    yield put(getMaterialTypeSuccess(response))
  } catch (error) {
    yield put(getMaterialTypeFail(error));
  }
}

function* addMaterialTypeSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addMaterialTypeApiCall,formData,isActive,0,false)
   yield put(addMaterialType(response));
  } catch (error) {
    yield put(getMaterialTypeFail(error));
  }
}
function* updateMaterialTypeSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addMaterialTypeApiCall,formData,isActive,Id,false)
   yield put(updateMaterialType(response));
  } catch (error) {
    yield put(getMaterialTypeFail(error));
  }
}
function* deleteMaterialTypeSaga(action) {
  try {
    const response = yield call(addMaterialTypeApiCall,'','',action.payload,true)
   yield put(deleteMaterialType(response))
  } catch (error) {
    yield put(getMaterialTypeFail(error))
  }
}

function* materialTypeAllSaga() {
  yield takeEvery(ADD_MATERIALTYPE_REQUEST, addMaterialTypeSaga)
  yield takeEvery(UPDATE_MATERIALTYPE_REQUEST, updateMaterialTypeSaga)
  yield takeEvery(DELETE_MATERIALTYPE_REQUEST, deleteMaterialTypeSaga)
  yield takeEvery(GET_MATERIALTYPE_REQUEST, materialTypeSaga)
}

export {materialTypeAllSaga} 