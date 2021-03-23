import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementMoveReducer from "./element-move";
import projectNewReducer from "./project-new";
import wireInsertJointReducer from "./wire-insert-joint";

const fieldReducer = concatReducers(
  elementAddReducer,
  projectNewReducer,
  elementDeleteReducer,
  elementMoveReducer,
  wireInsertJointReducer
);

export default fieldReducer;
