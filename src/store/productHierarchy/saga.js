import { takeEvery,call, put } from "redux-saga/effects";
import { getProductHierarchySuccess, getProductHierarchyFail,addProductHierarchy,updateProductHierarchy,deleteProductHierarchy } from "./actions";
import { ADD_PRODUCTHIERARCHY_REQUEST,GET_PRODUCTHIERARCHY_REQUEST,UPDATE_PRODUCTHIERARCHY_REQUEST,DELETE_PRODUCTHIERARCHY_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getProductHierarchy,addProductHierarchyApiCall } from "helpers/Api/api_productHierarchy";

function* productHierarchySaga() {
  try {
    const response = yield call(getProductHierarchy)
    
    yield put(getProductHierarchySuccess(response))
  } catch (error) {
    yield put(getProductHierarchyFail(error));
  }
}

function* addProductHierarchySaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addProductHierarchyApiCall,formData,isActive,0,false)
   yield put(addProductHierarchy(response));
  } catch (error) {
    yield put(getProductHierarchyFail(error));
  }
}
function* updateProductHierarchySaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addProductHierarchyApiCall,formData,isActive,Id,false)
   yield put(updateProductHierarchy(response));
  } catch (error) {
    yield put(getProductHierarchyFail(error));
  }
}
function* deleteProductHierarchySaga(action) {
  try {
    const response = yield call(addProductHierarchyApiCall,'','',action.payload,true)
   yield put(deleteProductHierarchy(response))
  } catch (error) {
    yield put(getProductHierarchyFail(error))
  }
}

function* productHierarchyAllSaga() {
  yield takeEvery(ADD_PRODUCTHIERARCHY_REQUEST, addProductHierarchySaga)
  yield takeEvery(UPDATE_PRODUCTHIERARCHY_REQUEST, updateProductHierarchySaga)
  yield takeEvery(DELETE_PRODUCTHIERARCHY_REQUEST, deleteProductHierarchySaga)
  yield takeEvery(GET_PRODUCTHIERARCHY_REQUEST, productHierarchySaga)
}

export {productHierarchyAllSaga} 