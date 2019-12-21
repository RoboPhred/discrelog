import { combineReducers } from "@/store/utils";

import circuitFieldReducer from "../components/CircuitFieldView/components/CircuitField/reducer";

import clipboardCopyReducer from "./clipboard-copy";
import clipboardPasteReducer from "./clipboard-paste";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeHoverReducer from "./node-hover";
import nodeMoveReducer from "./node-move";
import selectClearReducer from "./select-clear";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";

export default combineReducers(
  circuitFieldReducer,

  clipboardCopyReducer,
  clipboardPasteReducer,
  nodeAddReducer,
  nodeDeleteReducer,
  nodeHoverReducer,
  nodeMoveReducer,
  selectClearReducer,
  selectNodesReducer,
  selectRegionReducer,
  selectionCopyReducer,
  selectionDeleteReducer
);
