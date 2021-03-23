import { concatReducers } from "@/store/utils";

import connectionAttachReducer from "./connection-attach";
import connectionDetatchReducer from "./connection-detatch";
import connectionJointAddReducer from "./connection-joint-add";
import connectionJointDeleteReducer from "./connection-joint-delete";
import connectionJointMoveReducer from "./connection-joint-move";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementMoveReducer from "./element-move";
import projectNewReducer from "./project-new";
import wireInsertJointReducer from "./wire-insert-joint";

const fieldReducer = concatReducers(
  connectionAttachReducer,
  connectionDetatchReducer,
  connectionJointAddReducer,
  connectionJointDeleteReducer,
  connectionJointMoveReducer,
  elementAddReducer,
  projectNewReducer,
  elementDeleteReducer,
  elementMoveReducer,
  wireInsertJointReducer
);

export default fieldReducer;
