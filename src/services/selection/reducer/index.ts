import { concatReducers } from "@/store/utils";

import nodeDeleteReducer from "./node-delete";
import projectNewReducer from "./project-new";
import selectAllReducer from "./select-all";
import selectClearReducer from "./select-clear";
import selectJointsReducer from "./select-joints";
import selectNodesReducer from "./select-nodes";
import selectRegionReducer from "./select-region";
import selectWiresReducer from "./select-wires";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";
import selectionMoveReducer from "./selection-move";
import wireDetatchReducer from "./wire-detatch";

const selectionReducer = concatReducers(
  projectNewReducer,
  nodeDeleteReducer,
  selectAllReducer,
  selectClearReducer,
  selectJointsReducer,
  selectNodesReducer,
  selectRegionReducer,
  selectWiresReducer,
  selectionCopyReducer,
  selectionDeleteReducer,
  selectionMoveReducer,
  wireDetatchReducer
);

export default selectionReducer;
