import { AnyAction } from "redux";

import { AppState } from "@/store";
import { combineReducers } from "@/store/utils";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";

import circuitFieldReducer from "../ContentViews/CircuitField/reducer";

import addNodeReducer from "./node-add";
import deleteNodeReducer from "./node-delete";
import mouseOverNodeReducer from "./node-hover";
import moveNodeReducer from "./node-move";
import copySelectedNodesReducer from "./clipboard-copy";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import clearSelectionReducer from "./select-clear";

const circuitEditorCombinedReducer = combineReducers(
  addNodeReducer,
  deleteNodeReducer,
  mouseOverNodeReducer,
  moveNodeReducer,
  copySelectedNodesReducer,
  selectNodesReducer,
  selectRegionReducer,
  clearSelectionReducer
);

export default function circuitEditorReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction,
  appState: AppState
): CircuitEditorState {
  const newCircuitFieldState = circuitFieldReducer(
    state.circuitField,
    action as AnyAction
  );
  if (newCircuitFieldState != state.circuitField) {
    state = {
      ...state,
      circuitField: newCircuitFieldState
    };
  }

  return circuitEditorCombinedReducer(state, action, appState);
}
