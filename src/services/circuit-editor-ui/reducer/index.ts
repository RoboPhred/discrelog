import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import circuitEditReducer from "./circuit-edit";
import circuitNewReducer from "./circuit-new";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartJointReducer from "./drag-start-joint";
import dragStartNewJointReducer from "./drag-start-newjoint";
import dragStartNewNodeReducer from "./drag-start-newnode";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";
import viewZoomReducer from "./view-zoom";

export default concatReducers(
  circuitDeleteReducer,
  circuitEditReducer,
  circuitNewReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartJointReducer,
  dragStartNewJointReducer,
  dragStartNewNodeReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  dragStartWireReducer,
  mouseLeaveReducer,
  viewZoomReducer
);
