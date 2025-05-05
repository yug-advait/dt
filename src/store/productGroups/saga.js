import { takeEvery,call, put } from "redux-saga/effects";
import { getProductGroupsSuccess, getProductGroupsFail,addProductGroups,updateProductGroups,deleteProductGroups } from "./actions";
import { ADD_PRODUCTGROUPS_REQUEST,GET_PRODUCTGROUPS_REQUEST,UPDATE_PRODUCTGROUPS_REQUEST,DELETE_PRODUCTGROUPS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getProductGroups,addProductGroupsApiCall } from "helpers/Api/api_productGroups";

function* productgroupsSaga() {
  try {
    const response = yield call(getProductGroups)
    yield put(getProductGroupsSuccess(response))
  } catch (error) {
    yield put(getProductGroupsFail(error));
  }
}

function* addProductGroupsSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addProductGroupsApiCall,formData,isActive,0,false)
   yield put(addProductGroups(response));
  } catch (error) {
    yield put(getProductGroupsFail(error));
  }
}
function* updateProductGroupsSaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addProductGroupsApiCall,formData,isActive,Id,false)
   yield put(updateProductGroups(response));
  } catch (error) {
    yield put(getProductGroupsFail(error));
  }
}
function* deleteProductGroupsSaga(action) {
  try {
    const response = yield call(addProductGroupsApiCall,'','',action.payload,true)
   yield put(deleteProductGroups(response))
  } catch (error) {
    yield put(getProductGroupsFail(error))
  }
}

function* productGroupsAllSaga() {
  yield takeEvery(ADD_PRODUCTGROUPS_REQUEST, addProductGroupsSaga)
  yield takeEvery(UPDATE_PRODUCTGROUPS_REQUEST, updateProductGroupsSaga)
  yield takeEvery(DELETE_PRODUCTGROUPS_REQUEST, deleteProductGroupsSaga)
  yield takeEvery(GET_PRODUCTGROUPS_REQUEST, productgroupsSaga)
}

export {productGroupsAllSaga} 