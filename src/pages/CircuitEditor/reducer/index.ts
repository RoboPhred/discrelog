import { reduceReducers } from "@/store/utils";

import circuitFieldReducer from "../components/CircuitFieldView/components/CircuitField/reducer";

import nodeDeleteReducer from "./node-delete";
import nodeHoverReducer from "./node-hover";
import selectClearReducer from "./select-clear";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";

export default reduceReducers(
  circuitFieldReducer,

  nodeDeleteReducer,
  nodeHoverReducer,
  selectClearReducer,
  selectNodesReducer,
  selectRegionReducer,
  selectionCopyReducer,
  selectionDeleteReducer
);
