import { concatReducers } from "@/store/utils";

import dragAbortReducer from "./drag-abort";
import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartConnectionJointReducer from "./drag-start-connection-joint";
import dragStartConnectionNewJointReducer from "./drag-start-connection-newjoint";
import dragStartConnectionReducer from "./drag-start-connection";
import dragStartElementReducer from "./drag-start-element";
import dragStartSelectReducer from "./drag-start-select";
import dragStartWireReducer from "./drag-start-wire";
import mouseLeaveReducer from "./mouse-leave";

export default concatReducers(
  dragAbortReducer,
  dragContinueReducer,
  dragEndReducer,
  dragStartConnectionJointReducer,
  dragStartConnectionNewJointReducer,
  dragStartConnectionReducer,
  dragStartElementReducer,
  dragStartSelectReducer,
  dragStartWireReducer,
  mouseLeaveReducer
);
