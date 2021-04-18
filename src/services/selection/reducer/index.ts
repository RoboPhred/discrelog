import { concatReducers } from "@/store/utils";

import elementDeleteReducer from "./element-delete";
import projectNewReducer from "./project-new";
import selectAllReducer from "./select-all";
import selectClearReducer from "./select-clear";
import selectElementsReducer from "./select-elements";
import selectRegionReducer from "./select-region";
import selectWireJointsReducer from "./select-wire-joints";
import selectWireSegmentsReducer from "./select-wire-segments";
import selectionAlignToGrid from "./selection-align-to-grid";
import selectionCopyReducer from "./selection-copy";
import selectionDeleteReducer from "./selection-delete";
import selectionMoveReducer from "./selection-move";
import wireJointDeleteReducer from "./wire-joint-delete";

const selectionReducer = concatReducers(
  projectNewReducer,
  elementDeleteReducer,
  selectAllReducer,
  selectClearReducer,
  selectElementsReducer,
  selectRegionReducer,
  selectWireJointsReducer,
  selectWireSegmentsReducer,
  selectionAlignToGrid,
  selectionCopyReducer,
  selectionDeleteReducer,
  selectionMoveReducer,
  wireJointDeleteReducer
);

export default selectionReducer;
