import { takeEvery, put, call, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes"
import { loginSuccess, logoutUserSuccess, apiError } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
  postLogout,
} from "../../../helpers/backend_helper"
import { requestPermission } from "../../../firebase/configration"; 


const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  try {
    let fcm_token = null;
      // fcm_token = yield call(requestPermission); 
      fcm_token = localStorage.getItem("fcmToken");
      
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      )
      yield put(loginSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        // login_as:user.login_as,
        password: user.password,
        fcm_token,
 
      })
      if(response?.success){
        localStorage.setItem("authUser", JSON.stringify(response))
        yield put(loginSuccess(response))
        if(response?.login_as=='vendor'){
          history.replace({ pathname: '/vendor/dashboard'});
        }else{
          history.replace({ pathname: '/dashboard'});
        }
      }else{
        yield put(apiError(response))
      }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    yield call(postLogout);
    
    // Local storage clear karna
    localStorage.removeItem("authUser");
    localStorage.removeItem("vendorData");
    localStorage.removeItem("employeeData");
    localStorage.removeItem("adminData");
    localStorage.removeItem("productData");
    localStorage.removeItem("customerData");

    yield put(logoutUserSuccess());
    history.replace("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}


function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type
      )
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
