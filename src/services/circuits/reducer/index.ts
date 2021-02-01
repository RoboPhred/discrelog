import { concatReducers } from "@/store/utils";

import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import projectNewReducer from "./project-new";

export default concatReducers(
  nodeAddReducer,
  nodeDeleteReducer,
  projectNewReducer
);
