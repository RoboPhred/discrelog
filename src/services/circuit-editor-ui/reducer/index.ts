import { concatReducers } from "@/store/utils";

import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartJointReducer from "./drag-start-joint";
import dragStartNewJointReducer from "./drag-start-newjoint";
import dragStartNewNodeReducer from "./drag-start-newnode";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";

export default concatReducers(
  dragContinueReducer,
  dragEndReducer,
  dragStartJointReducer,
  dragStartNewJointReducer,
  dragStartNewNodeReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  dragStartWireReducer,
  mouseLeaveReducer
);
