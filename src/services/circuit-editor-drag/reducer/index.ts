import { concatReducers } from "@/store/utils";

import dragAbortReducer from "./drag-abort";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartElementReducer from "./drag-start-element";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireJointReducer from "./drag-start-wire-joint";
import dragStartWireSegmentReducer from "./drag-start-wire-segment";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";

export default concatReducers(
  dragAbortReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartElementReducer,
  dragStartSelectReducer,
  dragStartWireJointReducer,
  dragStartWireSegmentReducer,
  dragStartWireReducer,
  mouseLeaveReducer
);
