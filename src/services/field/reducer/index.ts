import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import fileNewReducer from "./file-new";
import nodeDeleteReducer from "./node-delete";
import nodeMoveReducer from "./selection-move";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";
import wireJointAddReducer from "./wire-joint-add";
import wireJointDeleteReducer from "./wire-joint-delete";
import wireJointMoveReducer from "./wire-joint-move";

const fieldReducer = concatReducers(
  elementAddReducer,
  fileNewReducer,
  nodeDeleteReducer,
  nodeMoveReducer,
  wireAttachReducer,
  wireDetatchReducer,
  wireJointAddReducer,
  wireJointDeleteReducer,
  wireJointMoveReducer
);

export default fieldReducer;
