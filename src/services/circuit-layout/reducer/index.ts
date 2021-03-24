import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementMoveReducer from "./element-move";
import projectNewReducer from "./project-new";

const fieldReducer = concatReducers(
  elementAddReducer,
  elementDeleteReducer,
  elementMoveReducer,
  projectNewReducer
);

export default fieldReducer;
