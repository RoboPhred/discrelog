import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import circuitRenameReducer from "./circuit-rename";
import projectNewReducer from "./project-new";

export default concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  circuitRenameReducer,
  projectNewReducer
);
