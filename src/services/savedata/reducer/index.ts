import { concatReducers } from "@/store/utils";

import autosaveReducer from "./autosave";
import initReducer from "./init";
import projectNewReducer from "./project-new";
import projectReceiveReducer from "./project-receive";

export default concatReducers(
  autosaveReducer,
  projectNewReducer,
  initReducer,
  projectReceiveReducer
);
