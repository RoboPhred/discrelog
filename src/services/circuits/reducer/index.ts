import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import circuitImportReducer from "./circuit-import";
import circuitRenameReducer from "./circuit-rename";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import projectNewReducer from "./project-new";

export default concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  circuitImportReducer,
  circuitRenameReducer,
  elementAddReducer,
  elementDeleteReducer,
  projectNewReducer
);
