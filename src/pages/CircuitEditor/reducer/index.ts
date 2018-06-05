import produce from "immer";

import { AppState } from "@/store";

import { SimulatorAction, ACTION_NODE_ADD } from "@/services/simulator/actions";

import {
  CircuitEditorAction,
  ACTION_NODE_HOVER,
  ACTION_MOVE_SELECTED,
  ACTION_SELECT_REGION,
  ACTION_SELECT_CLEAR,
  ACTION_SELECT_NODES
} from "../actions";
import { CircuitEditorState, defaultCircuitEditorState } from "../state";

import circuitFieldReducer from "../ContentViews/CircuitField/reducer";

import addNodeReducer from "./add-node";
import mouseOverNodeReducer from "./hover-node";
import moveSelectedNodesReducer from "./move-selected-nodes";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import clearSelectionReducer from "./clear-selection";
import { AnyAction } from "redux";

export default function circuitEditorReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: CircuitEditorAction | SimulatorAction,
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

  switch (action.type) {
    case ACTION_NODE_ADD:
      return addNodeReducer(state, action);
    case ACTION_NODE_HOVER:
      return mouseOverNodeReducer(state, action);
    case ACTION_MOVE_SELECTED:
      return moveSelectedNodesReducer(state, action);
    case ACTION_SELECT_NODES:
      return selectNodesReducer(state, action);
    case ACTION_SELECT_REGION:
      return selectRegionReducer(state, action, appState);
    case ACTION_SELECT_CLEAR:
      return clearSelectionReducer(state, action);
  }
  return state;
}
