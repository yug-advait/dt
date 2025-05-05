import { GET_PRODUCTGROUPS, ADD_PRODUCTGROUPS_SUCCESS, GET_PRODUCTGROUPS_FAIL, GET_PRODUCTGROUPS_SUCCESS,
  UPDATE_PRODUCTGROUPS_SUCCESS,DELETE_PRODUCTGROUPS_SUCCESS
 } from "./actionTypes"
export const getProductGroups = () => ({
  type: GET_PRODUCTGROUPS,
})

export const getProductGroupsSuccess = productGroups => 
  ({
  type: GET_PRODUCTGROUPS_SUCCESS,
  payload: productGroups,
})

export const addProductGroups= productGroupsData => ({
  type: ADD_PRODUCTGROUPS_SUCCESS,
  payload: productGroupsData,
});

export const updateProductGroups = productGroupsData => ({
  type: UPDATE_PRODUCTGROUPS_SUCCESS,
  payload: productGroupsData,
});

export const deleteProductGroups = productGroupsData => ({
  type: DELETE_PRODUCTGROUPS_SUCCESS,
  payload: productGroupsData,
});

export const getProductGroupsFail = error => ({
  type: GET_PRODUCTGROUPS_FAIL,
  payload: error,
})
