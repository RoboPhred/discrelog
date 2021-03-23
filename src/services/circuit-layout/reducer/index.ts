import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementMoveReducer from "./element-move";
import projectNewReducer from "./project-new";
import wireHydrateReducer from "./wire-hydrate";
import wireInsertJointReducer from "./wire-insert-joint";

const fieldReducer = concatReducers(
  elementAddReducer,
  elementDeleteReducer,
  elementMoveReducer,
  projectNewReducer,
  wireHydrateReducer,
  wireInsertJointReducer
);

export default fieldReducer;
