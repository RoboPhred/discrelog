import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import editorFocusReducer from "./editor-focus";
import projectNewReducer from "./project-new";
import viewCircuitReducer from "./view-circuit";

export default concatReducers(
  circuitDeleteReducer,
  editorFocusReducer,
  projectNewReducer,
  viewCircuitReducer
);
