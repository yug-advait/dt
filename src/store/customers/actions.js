import { GET_CUSTOMERS, ADD_CUSTOMERS_SUCCESS, GET_CUSTOMERS_FAIL, GET_CUSTOMERS_SUCCESS,
  UPDATE_CUSTOMERS_SUCCESS,DELETE_CUSTOMERS_SUCCESS
 } from "./actionTypes"
export const getCustomers = () => ({
  type: GET_CUSTOMERS,
})

export const getCustomersSuccess = Customers => ({
  type: GET_CUSTOMERS_SUCCESS,
  payload: Customers,
})

export const addCustomers= CustomersData => ({
  type: ADD_CUSTOMERS_SUCCESS,
  payload: CustomersData,
});

export const updateCustomers = CustomersData => ({
  type: UPDATE_CUSTOMERS_SUCCESS,
  payload: CustomersData,
});

export const deleteCustomers = CustomersData => ({
  type: DELETE_CUSTOMERS_SUCCESS,
  payload: CustomersData,
});

export const getCustomersFail = error => ({
  type: GET_CUSTOMERS_FAIL,
  payload: error,
})
