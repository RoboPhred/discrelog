import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementMoveReducer from "./element-move";
import projectNewReducer from "./project-new";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";
import wireJointAddReducer from "./wire-joint-add";
import wireJointDeleteReducer from "./wire-joint-delete";
import wireJointMoveReducer from "./wire-joint-move";

const fieldReducer = concatReducers(
  elementAddReducer,
  projectNewReducer,
  elementDeleteReducer,
  elementMoveReducer,
  wireAttachReducer,
  wireDetatchReducer,
  wireJointAddReducer,
  wireJointDeleteReducer,
  wireJointMoveReducer
);

export default fieldReducer;
