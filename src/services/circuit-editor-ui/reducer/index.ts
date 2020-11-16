import { concatReducers } from "@/store/utils";

import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartNewNodeReducer from "./drag-start-newnode";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import mouseLeaveReducer from "./mouse-leave";
import viewZoomReducer from "./view-zoom";

export default concatReducers(
  dragContinueReducer,
  dragEndReducer,
  dragStartNewNodeReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  mouseLeaveReducer,
  viewZoomReducer
);
