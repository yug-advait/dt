import { takeEvery,call, put } from "redux-saga/effects";
import { getCostCenterSuccess, getCostCenterFail,addCostCenter,updateCostCenter,deleteCostCenter } from "./actions";
import { ADD_COSTCENTER_REQUEST,GET_COSTCENTER_REQUEST,UPDATE_COSTCENTER_REQUEST,DELETE_COSTCENTER_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getCostCenter,addCostCenterApiCall } from "helpers/Api/api_costCenter";

function* costcenterSaga(action) {
  const {cost_profit_type } = action.payload
  try {
    const response = yield call(getCostCenter, cost_profit_type)
    yield put(getCostCenterSuccess(response))
  } catch (error) {
    yield put(getCostCenterFail(error));
  }
}

function* addCostCenterSaga(action) {
  const {formData,cost_profit_type,isActive } = action.payload
  try {
    const response = yield call(addCostCenterApiCall,formData,isActive,0,false,cost_profit_type)
   yield put(addCostCenter(response));
  } catch (error) {
    yield put(getCostCenterFail(error));
  }
}
function* updateCostCenterSaga(action) {
  const {formData,cost_profit_type,isActive,Id } = action.payload
  try {
    const response = yield call(addCostCenterApiCall,formData,isActive,Id,false,cost_profit_type)
   yield put(updateCostCenter(response));
  } catch (error) {
    yield put(getCostCenterFail(error));
  }
}
function* deleteCostCenterSaga(action) {
  try {
    const response = yield call(addCostCenterApiCall,'','',action.payload,true,'')
   yield put(deleteCostCenter(response))
  } catch (error) {
    yield put(getCostCenterFail(error))
  }
}

function* costcenterAllSaga() {
  yield takeEvery(ADD_COSTCENTER_REQUEST, addCostCenterSaga)
  yield takeEvery(UPDATE_COSTCENTER_REQUEST, updateCostCenterSaga)
  yield takeEvery(DELETE_COSTCENTER_REQUEST, deleteCostCenterSaga)
  yield takeEvery(GET_COSTCENTER_REQUEST, costcenterSaga)
}

export {costcenterAllSaga} 