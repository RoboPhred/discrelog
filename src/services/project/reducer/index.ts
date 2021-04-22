import { concatReducers } from "@/store/utils";

import projectModifiedReducer from "./project-modified";
import projectNewReducer from "./project-new";
import projectReceiveReducer from "./project-receive";
import projectRenameReducer from "./project-rename";
import projectSaveSuccessReducer from "./project-save-success";

export default concatReducers(
  projectModifiedReducer,
  projectNewReducer,
  projectReceiveReducer,
  projectRenameReducer,
  projectSaveSuccessReducer
);
