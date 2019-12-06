import { AnyAction } from "redux";

import { AppState } from "@/store";

import {
  ACTION_NODE_DELETE,
  DeleteNodeAction
} from "@/services/simulator/actions/node-delete";

import {
  CircuitEditorAction,
  ACTION_NODE_ADD,
  ACTION_NODE_HOVER,
  ACTION_NODE_MOVE,
  ACTION_COPY_NODES,
  ACTION_SELECT_REGION,
  ACTION_SELECT_CLEAR,
  ACTION_SELECT_NODES
} from "../actions";
import { CircuitEditorState, defaultCircuitEditorState } from "../state";

import circuitFieldReducer from "../ContentViews/CircuitField/reducer";

import addNodeReducer from "./add-node";
import deleteNodeReducer from "./delete-node";
import mouseOverNodeReducer from "./hover-node";
import moveNodeReducer from "./move-node";
import copySelectedNodesReducer from "./copy-nodes";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import clearSelectionReducer from "./clear-selection";

export default function circuitEditorReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: CircuitEditorAction | DeleteNodeAction,
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
    case ACTION_NODE_DELETE:
      return deleteNodeReducer(state, action);
    case ACTION_NODE_HOVER:
      return mouseOverNodeReducer(state, action);
    case ACTION_NODE_MOVE:
      return moveNodeReducer(state, action);
    case ACTION_COPY_NODES:
      return copySelectedNodesReducer(state, action, appState);
    case ACTION_SELECT_NODES:
      return selectNodesReducer(state, action);
    case ACTION_SELECT_REGION:
      return selectRegionReducer(state, action, appState);
    case ACTION_SELECT_CLEAR:
      return clearSelectionReducer(state, action);
  }
  return state;
}
