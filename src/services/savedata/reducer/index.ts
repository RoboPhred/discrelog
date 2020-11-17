import { concatReducers } from "@/store/utils";

import autosaveReducer from "./autosave";
import fileNewReducer from "./file-new";
import initReducer from "./init";
import projectReceiveReducer from "./project-receive";

export default concatReducers(
  autosaveReducer,
  fileNewReducer,
  initReducer,
  projectReceiveReducer
);
