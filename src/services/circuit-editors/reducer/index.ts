import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import editorFocusReducer from "./editor-focus";
import viewCircuitReducer from "./view-circuit";

export default concatReducers(
  circuitDeleteReducer,
  editorFocusReducer,
  viewCircuitReducer
);
