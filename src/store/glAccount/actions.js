import { GET_GLACCOUNT, ADD_GLACCOUNT_SUCCESS, GET_GLACCOUNT_FAIL, GET_GLACCOUNT_SUCCESS,
  UPDATE_GLACCOUNT_SUCCESS,DELETE_GLACCOUNT_SUCCESS
 } from "./actionTypes"
export const getGLAccount = () => ({
  type: GET_GLACCOUNT,
})

export const getGLAccountSuccess = GLAccount => ({
  type: GET_GLACCOUNT_SUCCESS,
  payload: GLAccount,
})

export const addGLAccount= GLAccountData => ({
  type: ADD_GLACCOUNT_SUCCESS,
  payload: GLAccountData,
});

export const updateGLAccount = GLAccountData => ({
  type: UPDATE_GLACCOUNT_SUCCESS,
  payload: GLAccountData,
});

export const deleteGLAccount = GLAccountData => ({
  type: DELETE_GLACCOUNT_SUCCESS,
  payload: GLAccountData,
});

export const getGLAccountFail = error => ({
  type: GET_GLACCOUNT_FAIL,
  payload: error,
})
