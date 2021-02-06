import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeMoveReducer from "./node-move";
import projectNewReducer from "./project-new";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";
import wireJointAddReducer from "./wire-joint-add";
import wireJointDeleteReducer from "./wire-joint-delete";
import wireJointMoveReducer from "./wire-joint-move";

const fieldReducer = concatReducers(
  circuitDeleteReducer,
  nodeAddReducer,
  projectNewReducer,
  nodeDeleteReducer,
  nodeMoveReducer,
  wireAttachReducer,
  wireDetatchReducer,
  wireJointAddReducer,
  wireJointDeleteReducer,
  wireJointMoveReducer
);

export default fieldReducer;
