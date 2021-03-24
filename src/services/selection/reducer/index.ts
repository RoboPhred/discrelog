import { concatReducers } from "@/store/utils";

import elementDeleteReducer from "./element-delete";
import projectNewReducer from "./project-new";
import selectAllReducer from "./select-all";
import selectClearReducer from "./select-clear";
import selectElementsReducer from "./select-elements";
import selectJointsReducer from "./select-joints";
import selectRegionReducer from "./select-region";
import selectionAlignToGrid from "./selection-align-to-grid";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";
import selectionMoveReducer from "./selection-move";

const selectionReducer = concatReducers(
  projectNewReducer,
  elementDeleteReducer,
  selectAllReducer,
  selectClearReducer,
  selectElementsReducer,
  selectJointsReducer,
  selectRegionReducer,
  selectionAlignToGrid,
  selectionCopyReducer,
  selectionDeleteReducer,
  selectionMoveReducer
);

export default selectionReducer;
