import { concatReducers } from "@/store/utils";

import elementDeleteReducer from "./element-delete";
import projectNewReducer from "./project-new";
import selectAllReducer from "./select-all";
import selectClearReducer from "./select-clear";
import selectElementsReducer from "./select-elements";
import selectJointsReducer from "./select-joints";
import selectRegionReducer from "./select-region";
import selectWiresReducer from "./select-wires";
import selectionAlignToGrid from "./selection-align-to-grid";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";
import selectionMoveReducer from "./selection-move";
import wireDetatchReducer from "./wire-detatch";

const selectionReducer = concatReducers(
  projectNewReducer,
  elementDeleteReducer,
  selectAllReducer,
  selectClearReducer,
  selectJointsReducer,
  selectElementsReducer,
  selectRegionReducer,
  selectWiresReducer,
  selectionAlignToGrid,
  selectionCopyReducer,
  selectionDeleteReducer,
  selectionMoveReducer,
  wireDetatchReducer
);

export default selectionReducer;
