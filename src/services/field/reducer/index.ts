import { concatReducers } from "@/store/utils";

import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartNewNodeReducer from "./drag-start-newnode";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import elementAddReducer from "./element-add";
import fileNewReducer from "./file-new";
import mouseLeaveReducer from "./mouse-leave";
import nodeDeleteReducer from "./node-delete";
import nodeMoveReducer from "./selection-move";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";
import wireJointAddReducer from "./wire-joint-add";
import wireJointDeleteReducer from "./wire-joint-delete";
import wireJointMoveReducer from "./wire-joint-move";

const fieldReducer = concatReducers(
  dragContinueReducer,
  dragEndReducer,
  dragStartNewNodeReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  elementAddReducer,
  fileNewReducer,
  mouseLeaveReducer,
  nodeDeleteReducer,
  nodeMoveReducer,
  wireAttachReducer,
  wireDetatchReducer,
  wireJointAddReducer,
  wireJointDeleteReducer,
  wireJointMoveReducer
);

export default fieldReducer;
