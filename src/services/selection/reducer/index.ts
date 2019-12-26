import { reduceReducers } from "@/store/utils";

import nodeDeleteReducer from "./node-delete";
import selectClearReducer from "./select-clear";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import selectWiresReducer from "./select-wires";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";
import wireDetatchReducer from "./wire-detatch";

const selectionReducer = reduceReducers(
  nodeDeleteReducer,
  selectClearReducer,
  selectNodesReducer,
  selectRegionReducer,
  selectWiresReducer,
  selectionCopyReducer,
  selectionDeleteReducer,
  wireDetatchReducer
);

export default selectionReducer;
