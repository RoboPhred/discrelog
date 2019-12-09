import { combineReducers } from "@/store/utils";

import circuitFieldReducer from "../ContentViews/CircuitField/reducer";

import addNodeReducer from "./node-add";
import deleteNodeReducer from "./node-delete";
import mouseOverNodeReducer from "./node-hover";
import moveNodeReducer from "./node-move";
import copySelectedNodesReducer from "./clipboard-copy";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import clearSelectionReducer from "./select-clear";

export default combineReducers(
  circuitFieldReducer,
  addNodeReducer,
  deleteNodeReducer,
  mouseOverNodeReducer,
  moveNodeReducer,
  copySelectedNodesReducer,
  selectNodesReducer,
  selectRegionReducer,
  clearSelectionReducer
);
