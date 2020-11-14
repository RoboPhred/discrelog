import { createStore, compose, applyMiddleware } from "redux";
import freeze from "redux-freeze";
import createSagaMiddleware from "redux-saga";

import { doInit } from "@/actions/init";

import {
  actionSanitizer,
  stateSanitizer,
  actionsBlacklist,
} from "./devtool-sanitizer";

import saga from "./saga";
import reducer from "./reducer";

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer,
      stateSanitizer,
      actionsBlacklist,
    })) ||
  compose;

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(freeze, sagaMiddleware))
);

sagaMiddleware.run(saga);
store.dispatch(doInit());
