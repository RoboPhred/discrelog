import { reduceReducers } from "@/store/utils";

import nodeDeleteReducer from "./node-delete";
import selectClearReducer from "./select-clear";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";

const selectionReducer = reduceReducers(
  nodeDeleteReducer,
  selectClearReducer,
  selectNodesReducer,
  selectRegionReducer,
  selectionCopyReducer,
  selectionDeleteReducer
);

export default selectionReducer;
