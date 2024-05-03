import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from 'redux-thunk';
import rootReducer from "../reducers";

export default function configureStore() {
  let store = createStore(rootReducer, applyMiddleware(logger, thunk));
  return store;
}
