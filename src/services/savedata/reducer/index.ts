import { reduceReducers } from "@/store/utils";

import autosaveReducer from "./autosave";
import fileNewReducer from "./file-new";
import initReducer from "./init";

export default reduceReducers(autosaveReducer, fileNewReducer, initReducer);
