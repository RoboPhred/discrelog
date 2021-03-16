import { concatReducers } from "@/store/utils";

import dragAbortReducer from "./drag-abort";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartJointReducer from "./drag-start-joint";
import dragStartNewJointReducer from "./drag-start-newjoint";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";

export default concatReducers(
  dragAbortReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartJointReducer,
  dragStartNewJointReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  dragStartWireReducer,
  mouseLeaveReducer
);
