import { createStore, compose, applyMiddleware, AnyAction } from "redux";
import freeze from "redux-freeze";
import createSagaMiddleware from "redux-saga";

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
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer,
      stateSanitizer,
      actionsBlacklist,
    })) ||
  compose;

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  finalReducer,
  composeEnhancers(applyMiddleware(freeze, sagaMiddleware))
);

sagaMiddleware.run(saga);
store.dispatch(doInit());
