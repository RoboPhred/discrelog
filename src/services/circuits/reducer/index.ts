import { concatReducers } from "@/store/utils";

import circuitNewReducer from "./circuit-new";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import projectNewReducer from "./project-new";

export default concatReducers(
  circuitNewReducer,
  nodeAddReducer,
  nodeDeleteReducer,
  projectNewReducer
);
