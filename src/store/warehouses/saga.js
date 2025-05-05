import { takeEvery,call, put } from "redux-saga/effects";
import { getWarehousesSuccess, getWarehousesFail,addWarehouses,
  updateWarehouses,deleteWarehouses } from "./actions";
import { ADD_WAREHOUSES_REQUEST,GET_WAREHOUSES_REQUEST,UPDATE_WAREHOUSES_REQUEST,DELETE_WAREHOUSES_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getWarehouses,addWarehousesApiCall } from "helpers/Api/api_warehouses";

function* warehousesSaga() {
  try {
    const response = yield call(getWarehouses)
    yield put(getWarehousesSuccess(response))
  } catch (error) {
    yield put(getWarehousesFail(error));
  }
}

function* addWarehousesSaga(action) {
  const {formData,isActive } = action.payload
  try {
    const response = yield call(addWarehousesApiCall,formData,isActive,0,false)
   yield put(addWarehouses(response));
  } catch (error) {
    yield put(getWarehousesFail(error));
  }
}
function* updateWarehousesaga(action) {
  const {formData,isActive,Id } = action.payload
  try {
    const response = yield call(addWarehousesApiCall,formData,isActive,Id,false)
   yield put(updateWarehouses(response));
  } catch (error) {
    yield put(getWarehousesFail(error));
  }
}
function* deleteWarehousesSaga(action) {
  try {
    const response = yield call(addWarehousesApiCall,'','',action.payload,true)
   yield put(deleteWarehouses(response))
  } catch (error) {
    yield put(getWarehousesFail(error))
  }
}

function* WarehousesAllSaga() {
  yield takeEvery(ADD_WAREHOUSES_REQUEST, addWarehousesSaga)
  yield takeEvery(UPDATE_WAREHOUSES_REQUEST, updateWarehousesaga)
  yield takeEvery(DELETE_WAREHOUSES_REQUEST, deleteWarehousesSaga)
  yield takeEvery(GET_WAREHOUSES_REQUEST, warehousesSaga)
}

export {WarehousesAllSaga} 