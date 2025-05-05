import { GET_PRODUCTHIERARCHY, ADD_PRODUCTHIERARCHY_SUCCESS, GET_PRODUCTHIERARCHY_FAIL, GET_PRODUCTHIERARCHY_SUCCESS,
  UPDATE_PRODUCTHIERARCHY_SUCCESS,DELETE_PRODUCTHIERARCHY_SUCCESS
 } from "./actionTypes"
export const getProductHierarchy = () => ({
  type: GET_PRODUCTHIERARCHY,
})
                                                                
export const getProductHierarchySuccess = productHierarchy => 
  ({
  type: GET_PRODUCTHIERARCHY_SUCCESS,
  payload: productHierarchy,
})

export const addProductHierarchy= productHierarchyData => ({
  type: ADD_PRODUCTHIERARCHY_SUCCESS,
  payload: productHierarchyData,
});

export const updateProductHierarchy = productHierarchyData => ({
  type: UPDATE_PRODUCTHIERARCHY_SUCCESS,
  payload: productHierarchyData,
});

export const deleteProductHierarchy = productHierarchyData => ({
  type: DELETE_PRODUCTHIERARCHY_SUCCESS,
  payload: productHierarchyData,
});

export const getProductHierarchyFail = error => ({
  type: GET_PRODUCTHIERARCHY_FAIL,
  payload: error,
})
