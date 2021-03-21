import { concatReducers } from "@/store/utils";

import dragAbortReducer from "./drag-abort";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartElementReducer from "./drag-start-element";
import dragStartJointReducer from "./drag-start-joint";
import dragStartNewJointReducer from "./drag-start-newjoint";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";

export default concatReducers(
  dragAbortReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartJointReducer,
  dragStartNewJointReducer,
  dragStartElementReducer,
  dragStartSelectReducer,
  dragStartWireReducer,
  mouseLeaveReducer
);
