import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import projectNewReducer from "./project-new";

export default concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  nodeAddReducer,
  nodeDeleteReducer,
  projectNewReducer
);
