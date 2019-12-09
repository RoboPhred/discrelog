import { createStore, compose, applyMiddleware } from "redux";
import freeze from "redux-freeze";

import {
  actionSanitizer,
  stateSanitizer,
  actionsBlacklist
} from "./devtool-sanitizer";

import reducer from "./reducer";

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer,
      stateSanitizer,
      actionsBlacklist
    })) ||
  compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(freeze))
);
