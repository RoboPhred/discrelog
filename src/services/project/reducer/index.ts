import { concatReducers } from "@/store/utils";

import autosaveReducer from "./autosave";
import initReducer from "./init";
import projectModifiedReducer from "./project-modified";
import projectNewReducer from "./project-new";
import projectReceiveReducer from "./project-receive";
import projectRenameReducer from "./project-rename";
import projectSaveSuccessReducer from "./project-save-success";

export default concatReducers(
  autosaveReducer,
  initReducer,
  projectModifiedReducer,
  projectNewReducer,
  projectReceiveReducer,
  projectRenameReducer,
  projectSaveSuccessReducer
);
