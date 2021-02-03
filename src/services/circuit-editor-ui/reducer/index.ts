import { concatReducers } from "@/store/utils";

import circuitEditReducer from "./circuit-edit";
import circuitNewReducer from "./circuit-new";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartNewNodeReducer from "./drag-start-newnode";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";
import viewZoomReducer from "./view-zoom";

export default concatReducers(
  circuitEditReducer,
  circuitNewReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartNewNodeReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  dragStartWireReducer,
  mouseLeaveReducer,
  viewZoomReducer
);
