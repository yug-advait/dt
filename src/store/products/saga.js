import { takeEvery,call, put } from "redux-saga/effects";
import { getProductsSuccess, getProductsFail,addProducts,updateProducts,
  deleteProducts } from "./actions";
import { ADD_PRODUCTS_REQUEST,GET_PRODUCTS_REQUEST,UPDATE_PRODUCTS_REQUEST,DELETE_PRODUCTS_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getProducts,addProductsApiCall } from "helpers/Api/api_products";

function* ProductsSaga() {
  try {
    const response = yield call(getProducts)
    yield put(getProductsSuccess(response))
  } catch (error) {
    yield put(getProductsFail(error));
  }
}

function* addProductsSaga(action) {
  const {formData,techData } = action.payload
  try {
    const response = yield call(addProductsApiCall,formData,techData,true,0,false)
   yield put(addProducts(response));
  } catch (error) {
    yield put(getProductsFail(error));
  }
}
function* updateProductsSaga(action) {
  const {formData,techData,Id } = action.payload
  try {
    const response = yield call(addProductsApiCall,formData,techData,true,Id,false)
   yield put(updateProducts(response));
  } catch (error) {
    yield put(getProductsFail(error));
  }
}
function* deleteProductsSaga(action) {
  try {
    const response = yield call(addProductsApiCall,'','','',action.payload,true)
   yield put(deleteProducts(response))
  } catch (error) {
    yield put(getProductsFail(error))
  }
}

function* productsAllSaga() {
  yield takeEvery(ADD_PRODUCTS_REQUEST, addProductsSaga)
  yield takeEvery(UPDATE_PRODUCTS_REQUEST, updateProductsSaga)
  yield takeEvery(DELETE_PRODUCTS_REQUEST, deleteProductsSaga)
  yield takeEvery(GET_PRODUCTS_REQUEST, ProductsSaga)
}

export {productsAllSaga} 