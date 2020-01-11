import { reduceReducers } from "@/store/utils";

import fileNewReducer from "./file-new";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeMoveReducer from "./selection-move";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";
import wireJointAddReducer from "./wire-joint-add";
import wireJointMoveReducer from "./wire-joint-move";

const fieldReducer = reduceReducers(
  fileNewReducer,
  nodeAddReducer,
  nodeDeleteReducer,
  nodeMoveReducer,
  wireAttachReducer,
  wireDetatchReducer,
  wireJointAddReducer,
  wireJointMoveReducer
);

export default fieldReducer;
