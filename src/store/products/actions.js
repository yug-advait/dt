import { GET_PRODUCTS, ADD_PRODUCTS_SUCCESS, GET_PRODUCTS_FAIL, GET_PRODUCTS_SUCCESS,
  UPDATE_PRODUCTS_SUCCESS,DELETE_PRODUCTS_SUCCESS
 } from "./actionTypes"
export const getProducts = () => ({
  type: GET_PRODUCTS,
})

export const getProductsSuccess = Products => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: Products,
})

export const addProducts= ProductsData => ({
  type: ADD_PRODUCTS_SUCCESS,
  payload: ProductsData,
});

export const updateProducts = ProductsData => ({
  type: UPDATE_PRODUCTS_SUCCESS,
  payload: ProductsData,
});

export const deleteProducts = ProductsData => ({
  type: DELETE_PRODUCTS_SUCCESS,
  payload: ProductsData,
});

export const getProductsFail = error => ({
  type: GET_PRODUCTS_FAIL,
  payload: error,
})
