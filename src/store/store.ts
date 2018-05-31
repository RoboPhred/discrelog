import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducer";

const storeComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  storeComposer(applyMiddleware(thunk))
);
