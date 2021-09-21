import {
  createStore,
  compose,
  applyMiddleware,
  AnyAction,
  Middleware,
} from "redux";
import freeze from "redux-freeze";
import createSagaMiddleware from "redux-saga";

import { isTruthy } from "@/utils";
import { isDev } from "@/env";

import { doInit } from "@/actions/init";

import undoReducer from "@/undo/reducer";

import {
  actionSanitizer,
  stateSanitizer,
  actionsBlacklist,
} from "./devtool-sanitizer";

import { AppState, defaultAppState } from "./state";
import saga from "./saga";
import rootReducer from "./reducer";

function finalReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  state = undoReducer(state, action);
  state = rootReducer(state, action);
  return state;
}

const composeEnhancers =
  isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionSanitizer,
        stateSanitizer,
        actionsBlacklist,
      })
    : compose;

const sagaMiddleware = createSagaMiddleware();

const middleware: Middleware<any, any, any>[] = [
  isDev && freeze,
  sagaMiddleware,
].filter(isTruthy);

export const store = createStore(
  finalReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(saga);
store.dispatch(doInit());
