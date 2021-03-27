import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementRenameReducer from "./element-rename";
import projectNewReducer from "./project-new";
import wireConnectReducer from "./wire-connect";
import wireHydrateReducer from "./wire-hydrate";
import wireInsertJointReducer from "./wire-insert-joint";
import wireJointDeleteReducer from "./wire-joint-delete";
import wireJointMoveReducer from "./wire-joint-move";

const graphReducer = concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  elementAddReducer,
  elementDeleteReducer,
  elementRenameReducer,
  projectNewReducer,
  wireConnectReducer,
  wireHydrateReducer,
  wireInsertJointReducer,
  wireJointDeleteReducer,
  wireJointMoveReducer
);

export default graphReducer;
