import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  UPDATE_PERMISSON
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
  isUpdatePermisson:false
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        data:action.payload,
        error:"",
        loading: false,
      }
      break
    case LOGOUT_USER:
      state = { ...state }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break
    case UPDATE_PERMISSON:
      state = { ...state, isUpdatePermisson: !state.isUpdatePermisson}
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
