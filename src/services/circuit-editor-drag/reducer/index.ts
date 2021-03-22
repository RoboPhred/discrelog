import { concatReducers } from "@/store/utils";

import dragAbortReducer from "./drag-abort";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartConnectionReducer from "./drag-start-connection";
import dragStartElementReducer from "./drag-start-element";
import dragStartJointReducer from "./drag-start-joint";
import dragStartNewJointReducer from "./drag-start-newjoint";
import dragStartSelectReducer from "./drag-start-select";
import mouseLeaveReducer from "./mouse-leave";

export default concatReducers(
  dragAbortReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartConnectionReducer,
  dragStartJointReducer,
  dragStartNewJointReducer,
  dragStartElementReducer,
  dragStartSelectReducer,
  mouseLeaveReducer
);
