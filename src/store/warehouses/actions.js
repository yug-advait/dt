import { GET_WAREHOUSES, ADD_WAREHOUSES_SUCCESS, GET_WAREHOUSES_FAIL, GET_WAREHOUSES_SUCCESS,
  UPDATE_WAREHOUSES_SUCCESS,DELETE_WAREHOUSES_SUCCESS
 } from "./actionTypes"
export const getWarehouses = () => ({
  type: GET_WAREHOUSES,
})

export const getWarehousesSuccess = Warehouses => 
  ({
  type: GET_WAREHOUSES_SUCCESS,
  payload: Warehouses,
})

export const addWarehouses= WarehousesData => ({
  type: ADD_WAREHOUSES_SUCCESS,
  payload: WarehousesData,
});

export const updateWarehouses = WarehousesData => ({
  type: UPDATE_WAREHOUSES_SUCCESS,
  payload: WarehousesData,
});

export const deleteWarehouses = WarehousesData => ({
  type: DELETE_WAREHOUSES_SUCCESS,
  payload: WarehousesData,
});

export const getWarehousesFail = error => ({
  type: GET_WAREHOUSES_FAIL,
  payload: error,
})
