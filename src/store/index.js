import { createStore, applyMiddleware, compose,combineReducers  } from "redux";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";

import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga); 

export default store;
